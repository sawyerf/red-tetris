import io from 'socket.io-client';

export const connectSocket = () => {
	const socket = io('ws://localhost:3000');
	return socket;
}