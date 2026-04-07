export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  storageUsed: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type JobType = 'VIDEO_COMPRESS' | 'VIDEO_EDIT' | 'IMAGE_EDIT';

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  inputFile: { filename: string; size: number };
  outputFile?: { filename: string; size: number; key: string };
  settings: Record<string, unknown>;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  metadata?: {
    duration?: number;
    width?: number;
    height?: number;
    codec?: string;
  };
}

export type CompressPreset = 'low' | 'medium' | 'high' | 'custom';
