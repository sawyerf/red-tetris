import { Socket } from 'socket.io';

export const initSocket = (io: Socket) => {
    console.log('Start Socket');
    io.on('connection', (socket: Socket) => {
    });
}