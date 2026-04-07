import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../utils/prisma';
import { videoQueue, imageQueue } from '../services/queue.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const compressVideoSchema = z.object({
  fileId: z.string().uuid(),
  settings: z.object({
    preset: z.enum(['low', 'medium', 'high', 'custom']).default('medium'),
    resolution: z.string().optional(),
    videoBitrate: z.string().optional(),
    audioBitrate: z.string().optional(),
    fps: z.number().optional(),
    codec: z.enum(['libx264', 'libx265', 'libvpx-vp9']).optional(),
    format: z.enum(['mp4', 'webm', 'mkv']).optional(),
  }),
});

const editImageSchema = z.object({
  fileId: z.string().uuid(),
  settings: z.object({
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    quality: z.number().min(1).max(100).optional(),
    format: z.enum(['jpeg', 'png', 'webp']).optional(),
    maintainAspectRatio: z.boolean().optional(),
  }),
});

export async function compressVideo(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { fileId, settings } = compressVideoSchema.parse(req.body);

    const file = await prisma.file.findFirst({ where: { id: fileId, userId: req.userId! } });
    if (!file) return next(new AppError(404, 'File not found'));

    const job = await prisma.job.create({
      data: {
        userId: req.userId!,
        type: 'VIDEO_COMPRESS',
        status: 'PENDING',
        inputFile: { id: file.id, filename: file.filename, size: Number(file.size), key: file.storageKey },
        settings,
      },
    });

    await videoQueue.add({ jobId: job.id, userId: req.userId!, inputKey: file.storageKey, settings });

    res.status(201).json({ jobId: job.id, status: 'PENDING' });
  } catch (err) {
    next(err);
  }
}

export async function editImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { fileId, settings } = editImageSchema.parse(req.body);

    const file = await prisma.file.findFirst({ where: { id: fileId, userId: req.userId! } });
    if (!file) return next(new AppError(404, 'File not found'));

    const job = await prisma.job.create({
      data: {
        userId: req.userId!,
        type: 'IMAGE_EDIT',
        status: 'PENDING',
        inputFile: { id: file.id, filename: file.filename, size: Number(file.size), key: file.storageKey },
        settings,
      },
    });

    await imageQueue.add({ jobId: job.id, userId: req.userId!, inputKey: file.storageKey, settings });

    res.status(201).json({ jobId: job.id, status: 'PENDING' });
  } catch (err) {
    next(err);
  }
}

export async function getJobs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

export async function getJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await prisma.job.findFirst({ where: { id: req.params.id, userId: req.userId! } });
    if (!job) return next(new AppError(404, 'Job not found'));
    res.json(job);
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await prisma.job.findFirst({ where: { id: req.params.id, userId: req.userId! } });
    if (!job) return next(new AppError(404, 'Job not found'));
    await prisma.job.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
