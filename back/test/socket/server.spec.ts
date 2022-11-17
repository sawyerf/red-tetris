import { Socket } from "socket.io-client";
import Client from "socket.io-client";
import jwt from 'jsonwebtoken';

import '../../app';
import Token from "../../socket/token";
import type { TokenPayload } from "../../socket/token";

describe('Server Test', () => {
	let clientSocket: Socket;
	const userName: string = 'desbarres';
	const roomName: string = 'Big Room';

	beforeAll((done) => {
		clientSocket = Client(`ws://localhost:3000`);
		clientSocket.on("connect", done);
	});

	afterAll((done) => {
		clientSocket.disconnect();
		clientSocket.close();
		global.io.close();
		global.server.close();
		done()
	})

	test('Get Token', (done) => {
		clientSocket.on('token/new', (data) => {
			const token: TokenPayload = (jwt.decode(data.token) as TokenPayload);
			expect(token.iat > 0).toBe(true);
			clientSocket.off('token/new');
			done();
		})
		clientSocket.emit('token/get');
	})

	test('Set Token', (done) => {
		clientSocket.on('token/new', (data) => {
			const token: TokenPayload = (jwt.decode(data.token) as TokenPayload);
			expect(token.iat).toBe(1234);
			expect(token.username).toBe('testName');
			clientSocket.off('token/new');
			done();
		})
		const payload = {
			username: 'testName',
			idPlayer: '',
			room: '',
			iat: 1234
		}
		clientSocket.emit('token/set', { token: Token.createToken(payload) });
	})

	test('Set username', (done) => {
		clientSocket.on('token/new', (data) => {
			const token: TokenPayload = (jwt.decode(data.token) as TokenPayload);
			expect(token.username).toBe(userName);
			clientSocket.off('token/new');
			done();
		})

		clientSocket.emit('user/setname', { name: userName });
	})

	test('Create Room', (done) => {
		clientSocket.on('token/new', (data) => {
			const token: TokenPayload = (jwt.decode(data.token) as TokenPayload);
			expect(token.room != '').toBe(true);
			expect(token.idPlayer != '').toBe(true);
			clientSocket.off('token/new');
			done();
		})

		clientSocket.emit('room/create', {
			name: roomName,
			speed: 700,
			sizeTerrain: {
				sizeRow: 20,
				sizeColumn: 10
			},
		});
	})

	test('Get Room Player', (done) => {
		clientSocket.on('room/players', (data) => {
			expect(data.numberPlayer).toBe('1 / 6');
			expect(data.names).toStrictEqual(['desbarres']);
			clientSocket.off('room/players');
			done();
		})

		clientSocket.emit('room/getPlayers');
	})

	test('Start Game', (done) => {
		clientSocket.on('game/terrain', (data: { terrain: number[][] }) => {
			expect(data.terrain.length).toBe(20);
			for (let line of data.terrain) {
				expect(line.length).toBe(10);
			}
			clientSocket.off('game/terrain')
			done()
		})
		clientSocket.emit('game/key', { key: 'Enter' });
	})

	test('Play Game', (done) => {
		clientSocket.on('game/terrain', (data: { terrain: number[][] }) => {
			expect(data.terrain.length).toBe(20);
			for (let line of data.terrain) {
				expect(line.length).toBe(10);
			}
		})
		clientSocket.on('game/end', (data) => {
			expect(data.winnerName).toBe(userName)
			expect(data.score >= 0).toBe(true)
			clientSocket.off('game/end');
			clientSocket.off('game/terrain');
			done();
		})
		clientSocket.emit('game/key', { key: 'ArrowUp' });
		clientSocket.emit('game/key', { key: ' ' });
		for (let i = 0; i < 25; i++) {
			clientSocket.emit('game/key', { key: 'ArrowRight' });
			clientSocket.emit('game/key', { key: 'ArrowRight' });
			clientSocket.emit('game/key', { key: 'ArrowRight' });
			clientSocket.emit('game/key', { key: 'ArrowRight' });
			clientSocket.emit('game/key', { key: 'ArrowLeft' });
			clientSocket.emit('game/key', { key: 'ArrowLeft' });
			clientSocket.emit('game/key', { key: 'ArrowLeft' });
			clientSocket.emit('game/key', { key: 'ArrowLeft' });

			clientSocket.emit('game/key', { key: 'ArrowDown' });
		}
	})

	test('Leave Room', (done) => {
		clientSocket.on('token/new', (data) => {
			const token: TokenPayload = (jwt.decode(data.token) as TokenPayload);
			expect(token.room).toBe('');
			expect(token.idPlayer).toBe('');
			clientSocket.off('token/new');
			done();
		})

		clientSocket.emit('room/leave');
	})
})