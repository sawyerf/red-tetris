import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import Token from '@/utils/token';

let socket: Socket;

export const connectSocket = (): Socket => {
	if (socket) {
		console.log('Socket already exist ! ');
		return socket;
	}

	socket = io('ws://localhost:3000');

	socket.on('connect', () => {
		const token = Token.getRaw();

		if (token) {
			socket.emit('token/set', {token: token})
		} else {
			socket.emit('token/get');
		}

		socket.on('token/new', (data) => {
			Token.save(data.token);
		})
		
	})
	return socket;
}