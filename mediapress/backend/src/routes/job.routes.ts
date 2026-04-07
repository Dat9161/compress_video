import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { compressVideo, editImage, getJobs, getJob, deleteJob } from '../controllers/job.controller';

export const jobRouter = Router();

jobRouter.use(authenticate);

jobRouter.post('/compress-video', compressVideo);
jobRouter.post('/edit-image', editImage);
jobRouter.get('/', getJobs);
jobRouter.get('/:id', getJob);
jobRouter.delete('/:id', deleteJob);
