import { Server } from 'socket.io';
import { createServer } from 'http';

// Singleton io instance — được set bởi index.ts khi server khởi động
// Worker dùng ioEmitter để emit mà không cần import toàn bộ server
let _io: Server | null = null;

export function setIo(io: Server) {
  _io = io;
}

export const ioEmitter = {
  to: (room: string) => ({
    emit: (event: string, data: unknown) => {
      if (_io) _io.to(room).emit(event, data);
    },
  }),
};
