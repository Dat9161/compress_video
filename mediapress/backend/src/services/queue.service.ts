import Bull from 'bull';

export interface VideoCompressJobData {
  jobId: string;
  userId: string;
  inputKey: string;
  settings: {
    preset: 'low' | 'medium' | 'high' | 'custom';
    resolution?: string;   // e.g. "1280x720"
    videoBitrate?: string; // e.g. "1000k"
    audioBitrate?: string; // e.g. "128k"
    fps?: number;
    codec?: 'libx264' | 'libx265' | 'libvpx-vp9';
    format?: 'mp4' | 'webm' | 'mkv';
  };
}

export interface ImageEditJobData {
  jobId: string;
  userId: string;
  inputKey: string;
  settings: {
    width?: number;
    height?: number;
    quality?: number;      // 1-100
    format?: 'jpeg' | 'png' | 'webp';
    maintainAspectRatio?: boolean;
  };
}

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const videoQueue = new Bull<VideoCompressJobData>('video-compress', redisUrl);
export const imageQueue = new Bull<ImageEditJobData>('image-edit', redisUrl);
