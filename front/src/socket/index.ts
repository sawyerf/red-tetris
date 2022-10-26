import io from 'socket.io-client';

export const connectSocket = () => {
	const socket = io('ws://192.168.56.2:3000');
	return socket;
}