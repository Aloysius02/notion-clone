import {
  NextApiResponseServerIo
} from '@/lib/types';
import {
  Server as NetServer
} from 'http';
import {
  Server as ServerIO
} from 'socket.io';
import {
  NextApiRequest
} from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  try {
    if (!res.socket.server.io) {
      const path = '/api/socket/io';
      const httpServer: NetServer = res.socket.server as any;

      console.log('Initializing new Socket.IO server...');
      const io = new ServerIO(httpServer, {
        path,
        addTrailingSlash: false,
      });

      io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        socket.on('create-room', (fileId) => {
          socket.join(fileId);
          console.log(`Client ${socket.id} joined room: ${fileId}`);
        });

        socket.on('send-changes', (deltas, fileId) => {
          console.log(`Received changes from ${socket.id} for file: ${fileId}`, deltas);
          socket.to(fileId).emit('receive-changes', deltas, fileId);
        });

        socket.on('send-cursor-move', (range, fileId, cursorId) => {
          console.log(`Cursor move from ${socket.id} in file: ${fileId} by cursorId: ${cursorId}`, range);
          socket.to(fileId).emit('receive-cursor-move', range, fileId, cursorId);
        });

        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });

        socket.on('error', (err) => {
          console.error(`Socket error from ${socket.id}:`, err);
        });
      });

      res.socket.server.io = io;
      console.log('Socket.IO server initialized successfully.');
    } else {
      console.log('Socket.IO server already initialized.');
    }

    res.end();
  } catch (err) {
    console.error('Failed to initialize Socket.IO:', err);
    res.status(500).end('Internal Server Error');
  }
};

export default ioHandler;





  // import { NextApiResponseServerIo } from '@/lib/types';
  // import { Server as NetServer } from 'http';
  // import { Server as ServerIO } from 'socket.io';
  // import { NextApiRequest } from 'next';

  // export const config = {
  //   api: {
  //     bodyParser: false,
  //   },
  // };

  // const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  //   if (!res.socket.server.io) {
  //     const path = '/api/socket/io';
  //     const httpServer: NetServer = res.socket.server as any;
  //     const io = new ServerIO(httpServer, {
  //       path,
  //       addTrailingSlash: false,
  //     });
  //     io.on('connection', (s) => {
  //       s.on('create-room', (fileId) => {
  //         s.join(fileId);
  //       });
  //       s.on('send-changes', (deltas, fileId) => {
  //         console.log('CHANGE');
  //         s.to(fileId).emit('receive-changes', deltas, fileId);
  //       });
  //       s.on('send-cursor-move', (range, fileId, cursorId) => {
  //         s.to(fileId).emit('receive-cursor-move', range, fileId, cursorId);
  //       });
  //     });
  //     res.socket.server.io = io;
  //   }
  //   res.end();
  // };

  // export default ioHandler;