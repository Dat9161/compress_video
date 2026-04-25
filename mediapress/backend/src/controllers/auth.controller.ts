import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase and number'),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function generateTokens(userId: string) {
  const accessOpts: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as SignOptions['expiresIn'] };
  const refreshOpts: SignOptions = { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'] };
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, accessOpts);
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, refreshOpts);
  return { accessToken, refreshToken };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return next(new AppError(409, 'Email already registered'));

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { email: data.email, password: hashedPassword, name: data.name },
    });

    const tokens = generateTokens(user.id);
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, ...tokens });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.password) return next(new AppError(401, 'Invalid credentials'));

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return next(new AppError(401, 'Invalid credentials'));

    const tokens = generateTokens(user.id);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, ...tokens });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError(400, 'Refresh token required'));

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    const tokens = generateTokens(payload.userId);
    res.json(tokens);
  } catch {
    next(new AppError(401, 'Invalid refresh token'));
  }
}

export async function getMe(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, avatarUrl: true, storageUsed: true, createdAt: true },
    });
    if (!user) return next(new AppError(404, 'User not found'));
    res.json({ ...user, storageUsed: Number(user.storageUsed) });
  } catch (err) {
    next(err);
  }
}
