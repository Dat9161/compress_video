import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Ensure directories exist
['input', 'output'].forEach((dir) => {
  fs.mkdirSync(path.join(UPLOAD_DIR, dir), { recursive: true });
});

export const storageService = {
  getInputPath: (filename: string) => path.join(UPLOAD_DIR, 'input', filename),
  getOutputPath: (filename: string) => path.join(UPLOAD_DIR, 'output', filename),

  deleteFile: (filePath: string) => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  },

  getFileSize: (filePath: string): number => {
    try {
      return fs.statSync(filePath).size;
    } catch {
      return 0;
    }
  },
};
