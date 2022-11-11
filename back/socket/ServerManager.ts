import type { Socket, Server } from 'socket.io';
import Room, { Params } from '../utils/Room';
import Token from './token'
import type { TokenPayload } from './token'
import { SockCreateRoom } from './sockType';

const rooms: Room[] = [];

class SocketManager {
	socket: Socket;
	io: Server;
	payload: TokenPayload = {username: '', idPlayer: '', room: '', iat: Date.now()};
	handleActivated: string[] = [];
	room: Room | undefined;

	constructor(io: Server, socket: Socket) {
		this.io = io;
		this.socket = socket;
		this.tokenHandle();
		this.sendListRooms();
	}

	sendToken() {
		this.socket.emit('token/new', {token: Token.createToken(this.payload)});
	}

	sendListRooms () {
		const roomsList = rooms.filter((room) => !room.isStart).map((room) => {
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
		if (this.handleActivated.indexOf('tokenHandle') > -1) return ;
		this.handleActivated.push('tokenHandle');

		this.socket.on('token/get', () => {
			this.sendToken();
			this.userHandle();
		});

		this.socket.on('token/set', (data: { token: string }) => {
			const payload: false | TokenPayload = Token.checkToken(data.token);

			if (payload === false) {
				this.sendToken();
			} else {
				this.payload = payload;
				this.room = rooms.find((room) => room.uid == this.payload.room);
				if (this.room) {
					this.room.updatePlayer(this.payload.idPlayer, this.socket)
					this.socket.join(payload.room);
					this.GameHandle();
				} else {
					this.payload.room = ''
					this.sendToken();
				}
			}
			if (this.payload.username != '') this.RoomHandle();
			this.userHandle();
		});
	}

	userHandle() {
		if (this.handleActivated.indexOf('userHandle') > -1) return ;
		this.handleActivated.push('userHandle');
	
		this.socket.on('user/setname', (data) => {
			this.payload.username = data.name;
			if (this.payload.username != '') this.RoomHandle();
			this.sendToken();
		})
	}

	RoomHandle() {
		if (this.handleActivated.indexOf('RoomHandle') > -1) return ;
		this.handleActivated.push('RoomHandle');

		this.sendListRooms();
		this.socket.on('room/list', () => this.sendListRooms());

		this.socket.on('room/create', (data: SockCreateRoom) => {
			if (!data?.name || this.room) return ;
			const params: Params = {
				sizeRow: data.sizeTerrain.sizeRow,
				sizeColumn: data.sizeTerrain.sizeColumn,
				maxPlayer: 6,
				speedStart: data.speed,
				speedMin: 100,
			}
			if (params.speedStart > 1000) params.speedStart = 1000
			if (params.speedStart < 100) params.speedStart = 100
			if (params.speedMin > params.speedStart) params.speedMin = params.speedStart
			if (params.speedMin < 100) params.speedMin = 100

			const room: Room = new Room(this.io, data.name, params);
			rooms.push(room);
			this.payload.idPlayer = room.addPlayer(this.socket, this.payload);
			this.payload.room = room.uid;
			this.room = room;
			this.sendToken();
			this.GameHandle();
			this.sendListRooms();
		});

		this.socket.on('room/getPlayers', () => {
			this.room?.sendPlayers()
		})

		this.socket.on('room/join', (data) => {
			if (this.room) return ;
			this.room = rooms.find((room) => room.uid == data.roomId);
			if (this.room) {
				this.payload.idPlayer = this.room.addPlayer(this.socket, this.payload);
				if (this.payload.idPlayer != '') {
					this.payload.room = this.room.uid;
					this.sendToken();
					this.GameHandle();
				}
			}
			this.sendListRooms();
		});

		this.socket.on('room/leave', () => {
			if (this.payload.idPlayer != '') this.room?.leave(this.payload.idPlayer);
			if (this.room?.games.length === 0) rooms.splice(rooms.indexOf(this.room), 1);
			this.payload.room = '';
			this.payload.idPlayer = '';
			this.room = undefined;
			this.sendToken();
		});
	}

	GameHandle() {
		if (this.handleActivated.indexOf('GameHandle') > -1) return ;
		this.handleActivated.push('GameHandle');

		this.socket.on('game/key', (data) => this.room?.key(this.payload.idPlayer, data.key))
	}
}

export default SocketManager;