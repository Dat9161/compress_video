import { Response, NextFunction } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { prisma } from '../utils/prisma';
import { storageService } from '../services/storage.service';
import { AuthRequest } from '../middleware/auth.middleware';

function getVideoMetadata(filePath: string): Promise<ffmpeg.FfprobeData> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => (err ? reject(err) : resolve(data)));
  });
}

export async function uploadVideo(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = req.file!;
    const filePath = storageService.getInputPath(file.filename);

    let metadata: Record<string, unknown> = {};
    try {
      const probe = await getVideoMetadata(filePath);
      const stream = probe.streams.find((s) => s.codec_type === 'video');
      metadata = {
        duration: probe.format.duration,
        width: stream?.width,
        height: stream?.height,
        codec: stream?.codec_name,
        bitrate: probe.format.bit_rate,
      };
    } catch {
      // FFmpeg not installed or probe failed — continue without metadata
    }

    const dbFile = await prisma.file.create({
      data: {
        userId: req.userId!,
        type: 'INPUT',
        filename: file.originalname,
        storageKey: file.filename,
        size: file.size,
        mimeType: file.mimetype,
        metadata,
      },
    });

    res.status(201).json({
      id: dbFile.id,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      metadata,
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = req.file!;

    const dbFile = await prisma.file.create({
      data: {
        userId: req.userId!,
        type: 'INPUT',
        filename: file.originalname,
        storageKey: file.filename,
        size: file.size,
        mimeType: file.mimetype,
      },
    });

    res.status(201).json({
      id: dbFile.id,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    });
  } catch (err) {
    next(err);
  }
}
