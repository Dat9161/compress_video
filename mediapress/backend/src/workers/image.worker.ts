import 'dotenv/config';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import { imageQueue } from '../services/queue.service';
import type { ImageEditJobData } from '../services/queue.service';
import { prisma } from '../utils/prisma';
import { storageService } from '../services/storage.service';
import { ioEmitter } from '../utils/socket';
import { logger } from '../utils/logger';
import { configureFfmpeg } from '../utils/ffmpeg';

configureFfmpeg();

imageQueue.process(5, async (job) => {
  const { jobId, inputKey, settings } = job.data as ImageEditJobData;
  const inputPath = storageService.getInputPath(inputKey);
  const ext = settings.format || 'jpeg';
  const outputFilename = `${uuidv4()}.${ext}`;
  const outputPath = storageService.getOutputPath(outputFilename);

  await prisma.job.update({ where: { id: jobId }, data: { status: 'PROCESSING', startedAt: new Date() } });

  return new Promise<void>((resolve, reject) => {
    let cmd = ffmpeg(inputPath);

    if (settings.width || settings.height) {
      const w = settings.width || -1;
      const h = settings.height || -1;
      const size = settings.maintainAspectRatio !== false
        ? `${w === -1 ? '?' : w}x${h === -1 ? '?' : h}`
        : `${w}x${h}`;
      cmd = cmd.size(size);
    }

    if (settings.quality) {
      cmd = cmd.outputOptions([`-q:v ${Math.round((100 - settings.quality) / 10)}`]);
    }

    cmd
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
        resolve();
      })
      .on('error', async (err) => {
        await prisma.job.update({ where: { id: jobId }, data: { status: 'FAILED', errorMessage: err.message } });
        ioEmitter.to(jobId).emit('job:failed', { jobId, error: err.message });
        reject(err);
      })
      .save(outputPath);
  });
});

logger.info('Image worker started');
