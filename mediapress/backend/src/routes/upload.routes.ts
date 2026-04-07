import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { videoUpload, imageUpload } from '../services/upload.service';
import { uploadVideo, uploadImage } from '../controllers/upload.controller';

export const uploadRouter = Router();

uploadRouter.use(authenticate);

uploadRouter.post('/video', videoUpload.single('file'), uploadVideo);
uploadRouter.post('/image', imageUpload.single('file'), uploadImage);
