import { Socket } from "socket.io-client";
import Client from "socket.io-client";
import jwt from 'jsonwebtoken';

import '../../app';
import { TokenPayload } from "../../socket/token";

describe('Server Test', () => {
	let clientSocket: Socket;
	let jwtToken: string = '';

	beforeAll((done) => {
		clientSocket = Client(`http://localhost:3000`);
		clientSocket.on("connect", done);
	});

	afterAll(() => {
		global.io.close();
		clientSocket.close();
	})

	test('Get Token', (done) => {
		clientSocket.on('token/new', (data) => {
			const token: TokenPayload = jwt.decode(data.token);
			expect(token.iat > 0).toBe(true);
			clientSocket.off('token/new');
			done();
		})
		clientSocket.emit('token/get');
	})

	test('Set username', (done) => {
		const userName: string = 'desbarres';

		clientSocket.on('token/new', (data) => {
			const token: TokenPayload = jwt.decode(data.token);
			expect(token.username).toBe(userName);
			clientSocket.off('token/new');
			done();
		})

		clientSocket.emit('user/setname', { name: userName });
	})

	test('Create Room', (done) => {
		const roomName: string = 'Big Room';

		clientSocket.on('token/new', (data) => {
			const token: TokenPayload = jwt.decode(data.token);
			expect(token.room != '').toBe(true);
			expect(token.idPlayer != '').toBe(true);
			clientSocket.off('token/new');
			done();
		})

		clientSocket.emit('room/create', { name: roomName });
	})

	test('Get Room Player', (done) => {
		clientSocket.on('room/players', (data) => {
			expect(data.numberPlayer).toBe('1 / 6');
			expect(data.names).toStrictEqual(['desbarres']);
			done();
		})

		clientSocket.emit('room/getPlayers');
	})

	test('Start Game', (done) => {
		clientSocket.on('game/terrain', (data) => {
			done();
		})
		clientSocket.emit('game/key', { key: 'Enter' })
	})

})