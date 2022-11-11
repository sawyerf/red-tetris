import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import Token, { type TokenPayload } from '@/utils/token';
import router from '@/utils/router';

let socket: Socket;

export const connectSocket = (): Socket => {
	if (socket) {
		return socket;
	}

	socket = io('ws://localhost:3000');

	const routeByToken = () => {
		const payload: TokenPayload|null = Token.get();
		if (payload?.username == '') {
			router.replace('/');
		} else if (payload?.room == '') {
			if (router.currentRoute.value.path == '/create') return ;
			router.replace('/list');
		} else {
			router.replace('/game');
		}
	}

	socket.on('connect', () => {
		const token = Token.getRaw();

		if (token) {
			routeByToken();
			socket.emit('token/set', {token: token})
		} else {
			socket.emit('token/get');
		}

		socket.on('token/new', (data) => {
			Token.save(data.token);
			routeByToken();
		})
	})
	return socket;
}