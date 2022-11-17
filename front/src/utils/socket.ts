import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import Token, { type TokenPayload } from '@/utils/token';
import router from '@/utils/router';

let socket: Socket;

const routeByToken = () => {
	const payload: TokenPayload | null = Token.get();
	if (router.currentRoute.value.hash.match(/#.+?\[.+?\]/) && !payload?.room) {
		return ;
	} else if (payload?.username == '') {
		router.replace('/');
	} else if (payload?.room == '') {
		if (router.currentRoute.value.path == '/create') return;
		router.replace('/list');
	} else {
		router.replace('/game');
	}
}

export const connectSocket = (test: any = undefined): Socket => {
	if (socket) {
		return socket;
	}
	if (test) {
		socket = test;
		return socket
	}

	socket = io('ws://localhost:3000');

	socket.on('connect', () => {
		const token = Token.getRaw();

		if (token) {
			routeByToken();
			socket.emit('token/set', { token: token })
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