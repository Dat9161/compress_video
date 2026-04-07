import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocket() {
  if (!socket) socket = io({ path: '/socket.io' });
  return socket;
}

export function useJobSocket(jobId: string | null, onProgress: (pct: number) => void, onDone: () => void, onError: (msg: string) => void) {
  useEffect(() => {
    if (!jobId) return;
    const s = getSocket();
    s.emit('join', jobId);
    s.on('job:progress', ({ progress }: { progress: number }) => onProgress(progress));
    s.on('job:completed', () => onDone());
    s.on('job:failed', ({ error }: { error: string }) => onError(error));
    return () => {
      s.off('job:progress');
      s.off('job:completed');
      s.off('job:failed');
    };
  }, [jobId]);
}
