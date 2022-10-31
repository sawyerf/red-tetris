import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import { Server as ServerIO } from "socket.io";
import { Server } from 'http';
import type { Socket } from 'socket.io';

import { apiRouter } from './routes';
import SocketGame from './socket';

config();

declare global {
	var io: ServerIO
}

const app: Application = express();

app.use('/api', apiRouter);

const server: Server = app.listen(3000);

const io: ServerIO = new ServerIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

global.io = io;
console.log('Start Socket');

const listSocket: string[] = [];

io.on('connection', (socket: Socket) => {
    if (listSocket.indexOf(socket.id) > 0) {
        return ;
    }
    const socketG = new SocketGame(io, socket);
    listSocket.push(socket.id)
    io.on('disconnect', () => listSocket.splice(listSocket.indexOf(socket.id), 1));
});