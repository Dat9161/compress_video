import 'dotenv/config';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import { videoQueue } from '../services/queue.service';
import type { VideoCompressJobData } from '../services/queue.service';
import { prisma } from '../utils/prisma';
import { storageService } from '../services/storage.service';
import { ioEmitter } from '../utils/socket';
import { logger } from '../utils/logger';
import { configureFfmpeg } from '../utils/ffmpeg';

configureFfmpeg();

const PRESETS = {
  low:    { videoBitrate: '500k',  audioBitrate: '96k',  resolution: '854x480'   },
  medium: { videoBitrate: '1000k', audioBitrate: '128k', resolution: '1280x720'  },
  high:   { videoBitrate: '2500k', audioBitrate: '192k', resolution: '1920x1080' },
};

videoQueue.process(2, async (job) => {
  const { jobId, inputKey, settings } = job.data as VideoCompressJobData;
  const inputPath = storageService.getInputPath(inputKey);
  const outputFilename = `${uuidv4()}.${settings.format || 'mp4'}`;
  const outputPath = storageService.getOutputPath(outputFilename);

  await prisma.job.update({ where: { id: jobId }, data: { status: 'PROCESSING', startedAt: new Date() } });

  return new Promise<void>((resolve, reject) => {
    const preset = settings.preset !== 'custom' ? PRESETS[settings.preset] : null;
    const videoBitrate = settings.videoBitrate || preset?.videoBitrate || '1000k';
    const audioBitrate = settings.audioBitrate || preset?.audioBitrate || '128k';
    const resolution = settings.resolution || preset?.resolution;
    const codec = settings.codec || 'libx264';

    let cmd = ffmpeg(inputPath)
      .videoCodec(codec)
      .audioBitrate(audioBitrate)
      .videoBitrate(videoBitrate)
      .outputOptions(['-movflags faststart']);

    if (resolution) cmd = cmd.size(resolution);
    if (settings.fps) cmd = cmd.fps(settings.fps);

    cmd
      .on('progress', async (progress) => {
        const pct = Math.round(progress.percent || 0);
        await job.progress(pct);
        await prisma.job.update({ where: { id: jobId }, data: { progress: pct } });
        ioEmitter.to(jobId).emit('job:progress', { jobId, progress: pct });
      })
      .on('end', async () => {
        const outputSize = storageService.getFileSize(outputPath);
        const expiresAt = new Date(Date.now() + parseInt(process.env.FILE_RETENTION_DAYS || '7') * 86400000);

        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: 'COMPLETED',
            progress: 100,
            completedAt: new Date(),
            expiresAt,
            outputFile: { filename: outputFilename, size: outputSize, key: outputFilename },
          },
        });

        ioEmitter.to(jobId).emit('job:completed', { jobId });
        logger.info(`Job ${jobId} completed`);
        resolve();
      })
      .on('error', async (err) => {
        await prisma.job.update({ where: { id: jobId }, data: { status: 'FAILED', errorMessage: err.message } });
        ioEmitter.to(jobId).emit('job:failed', { jobId, error: err.message });
        logger.error(`Job ${jobId} failed: ${err.message}`);
        reject(err);
      })
      .save(outputPath);
  });
});

logger.info('Video worker started');
