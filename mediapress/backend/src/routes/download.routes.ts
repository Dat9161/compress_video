import { Router, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';
import { storageService } from '../services/storage.service';
import { AppError } from '../middleware/error.middleware';

export const downloadRouter = Router();

downloadRouter.get('/:jobId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await prisma.job.findFirst({ where: { id: req.params.jobId, userId: req.userId! } });
    if (!job) return next(new AppError(404, 'Job not found'));
    if (job.status !== 'COMPLETED') return next(new AppError(400, 'Job not completed yet'));
    if (job.expiresAt && job.expiresAt < new Date()) return next(new AppError(410, 'File has expired'));

    const outputFile = job.outputFile as { key: string; filename: string };
    const filePath = storageService.getOutputPath(outputFile.key);

    if (!fs.existsSync(filePath)) return next(new AppError(404, 'Output file not found'));

    res.download(filePath, outputFile.filename || path.basename(filePath));
  } catch (err) {
    next(err);
  }
});
