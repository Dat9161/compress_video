import ffmpeg from 'fluent-ffmpeg';
import { logger } from './logger';

/**
 * Cấu hình đường dẫn FFmpeg từ biến môi trường.
 * Nếu không set, fluent-ffmpeg sẽ tìm trong PATH hệ thống.
 */
export function configureFfmpeg() {
  if (process.env.FFMPEG_PATH) {
    ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
    logger.info(`FFmpeg path: ${process.env.FFMPEG_PATH}`);
  }
  if (process.env.FFPROBE_PATH) {
    ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
    logger.info(`FFprobe path: ${process.env.FFPROBE_PATH}`);
  }
}
