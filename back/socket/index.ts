import type { Socket, Server } from 'socket.io';
import Terrain from '../utils/Terrain';
import Game from '../utils/Game';
import Room from '../utils/Room';
import jwt from 'jsonwebtoken';

require('dotenv').config();

const secret: jwt.Secret = process.env.JWT_TOKEN || '';
const rooms: Room[] = [];

type TokenPayload = {
	indexPlayer: number;
	room: string;
	iat: number;
}

const checkToken = (token: string) => {
	let verified;
	try {
		verified = jwt.verify(token, secret);
	} catch {
		return false;
	}
	return verified as TokenPayload;
}

const createToken = (payload: TokenPayload) => {
	return jwt.sign(payload, secret);
}

class SocketGame {
	socket: Socket;
	io: Server;
	payload: TokenPayload = {indexPlayer: -1, room: '', iat: Date.now()};
	room: Room | undefined;

	constructor(io: Server, socket: Socket) {
		this.io = io;
		this.socket = socket;
		this.tokenHandle();
	}

	sendToken() {
		this.socket.emit('token/new', {token: createToken(this.payload)});
	}

	sendListRooms() {
		const roomsList = rooms.map((room) => {
			return {
				name: room.name,
				uid: room.uid,
				numberPlayer: room.games.length,
				maxPlayer: room.params.maxPlayer,
			}
		})
		this.io.sockets.emit('room/list', {rooms: roomsList});
	}

	tokenHandle() {
		this.socket.on('token/get', () => {
			this.sendToken();
			this.RoomHandle();
		});

		this.socket.on('token/set', (data) => {
			const payload: false | TokenPayload = checkToken(data.token);

			if (payload === false) {
				this.sendToken();
				this.RoomHandle();
			} else {
				this.payload = payload;
				this.socket.join(payload.room);
				this.RoomHandle();
				this.GameHandle();
			}
		});
	}

	RoomHandle() {
		this.socket.on('room/create', (data) => {
			const room: Room = new Room(this.io, data.name);
			this.payload.indexPlayer = room.addPlayer();
			this.payload.room = room.uid;
			this.socket.join(room.uid)
			this.sendToken();
			this.room = room;
			this.GameHandle();
		});

		this.socket.on('room/join', (data) => {
			this.room = rooms.find((room) => room.uid == data.roomId);
			if (this.room) {
				this.payload.indexPlayer = this.room.addPlayer();
				if (this.payload.indexPlayer > -1) {
					this.payload.room = this.room.uid;
					this.socket.join(this.room.uid)
					this.sendToken();
					this.GameHandle();
				}
			}
		});

		this.socket.on('room/leave', () => {});
	}

	GameHandle() {
		// this.socket.emit('game/terrain', {terrain: game.terrain.terrain});

		this.socket.on('game/key', (data) => this.room?.key(this.payload.indexPlayer, data.key))
	}
}

export default SocketGame;