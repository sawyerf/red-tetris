import { Socket } from 'socket.io';
import Terrain from '../utils/Terrain';
import Room from '../utils/Room';

export const initSocket = (io: Socket) => {
    console.log('Start Socket');
    io.on('connection', (socket: Socket) => {
        const room: Room = new Room();

        socket.emit('terrain', {terrain: room.terrain.terrain});
        socket.on('key', (data) => {
            console.log(data.key)
            if (data.key == 'Enter') room.startGame();
			if (room.isStart) {
				if (data.key == 'ArrowDown') room.fallPiece(room.tetrimo);
				if (data.key == 'ArrowUp') room.rotatePiece(room.tetrimo);
				if (data.key == 'ArrowRight') room.rightPiece(room.tetrimo);
				if (data.key == 'ArrowLeft') room.leftPiece(room.tetrimo);
				if (data.key == ' ') room.rotateVerticalyPiece(room.tetrimo);
			}
            socket.emit('terrain', {terrain: room.terrain.terrain});
        })
    });
}