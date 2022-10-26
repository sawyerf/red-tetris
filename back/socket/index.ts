import { Socket } from 'socket.io';
import Terrain from '../utils/Terrain';
import Game from '../utils/Game';
import jwt from 'jsonwebtoken';

const fakeSecret = 'lolipop';

const checkToken = (token: string) => {
    let verified;
    try {
        verified = jwt.verify(token, fakeSecret);
    } catch {
        return false;
    }
    return verified;
}

const createToken = () => {
    const token = jwt.sign({
    }, fakeSecret);
    return token;
}


export const initSocket = (io: Socket) => {
    console.log('Start Socket');
    io.on('connection', (socket: Socket) => {
        const game: Game = new Game(socket);

        socket.on('connect', (data) => {
            
        });

        socket.on('getToken', (data) => {
            
        });

        socket.emit('terrain', {terrain: game.terrain.terrain});
        socket.on('key', (data) => {
            // console.log(data.key)
            if (data.key == 'Enter') game.startGame();
			if (game.isStart) {
				if (data.key == 'ArrowDown') game.fallPiece();
				if (data.key == 'ArrowUp') game.rotatePiece();
				if (data.key == 'ArrowRight') game.rightPiece();
				if (data.key == 'ArrowLeft') game.leftPiece();
				if (data.key == ' ') game.rotateVerticalyPiece();
			}
        })
    });
}