// Libraries
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    });
    return server;
  }
}
