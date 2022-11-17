import { config } from 'dotenv';
import express, { Application } from 'express';
import { Server as ServerIO } from "socket.io";
import type { Socket } from 'socket.io';
import { Server } from 'http';

import SocketManager from './socket/ServerManager';

config();

declare global {
	var io: ServerIO
}

const app: Application = express();

const sendIndex = (req: any, res: any) => {
    res.sendFile('index.html', {'root': __dirname + '/../front/dist/'})
};

app.get("/", sendIndex);
app.get("/list", sendIndex);
app.get("/create", sendIndex);
app.get("/game", sendIndex);
app.use(express.static(process.cwd() + "/../front/dist/"));

const server: Server = app.listen(3000);

const io: ServerIO = new ServerIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

global.io = io;
console.log('Start Socket');

io.on('connection', (socket: Socket) => {
    const socketG = new SocketManager(io, socket);
    io.on('disconnect', () => console.log(socket.id, 'disconnect'));
});