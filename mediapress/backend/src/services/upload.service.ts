import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from './storage.service';
import { AppError } from '../middleware/error.middleware';

const MAX_VIDEO_MB = parseInt(process.env.MAX_VIDEO_SIZE_MB || '2048');
const MAX_IMAGE_MB = parseInt(process.env.MAX_IMAGE_SIZE_MB || '50');

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska', 'video/webm', 'video/x-flv'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];

function createStorage() {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, storageService.getInputPath('')),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });
}

export const videoUpload = multer({
  storage: createStorage(),
  limits: { fileSize: MAX_VIDEO_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new AppError(400, 'Invalid video format') as unknown as null, false);
  },
});

export const imageUpload = multer({
  storage: createStorage(),
  limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new AppError(400, 'Invalid image format') as unknown as null, false);
  },
});
