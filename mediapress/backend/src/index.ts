import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authRouter } from './routes/auth.routes';
import { uploadRouter } from './routes/upload.routes';
import { jobRouter } from './routes/job.routes';
import { downloadRouter } from './routes/download.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';
import { configureFfmpeg } from './utils/ffmpeg';
import { setIo } from './utils/socket';

configureFfmpeg();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173' },
});

// Đăng ký io singleton để worker dùng
setIo(io);

// Join room khi client kết nối
io.on('connection', (socket) => {
  socket.on('join', (jobId: string) => socket.join(jobId));
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/download', downloadRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
