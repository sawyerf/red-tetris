import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export const connectSocket = () => {
	const socket: Socket = io('ws://localhost:3000');

	socket.on('connect', () => {
		socket.emit('token/get');

		socket.on('token/new', (data) => {
			console.log(data.token);
			// socket.emit('token/set', {token: data.token});
		})
		
	})
	return socket;
}