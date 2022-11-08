import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import { Server as ServerIO } from "socket.io";
import type { Socket } from 'socket.io';
import { Server } from 'http';

import SocketManager from './socket/ServerManager';

config();

declare global {
	var io: ServerIO
}

const app: Application = express();
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
        console.log('try reconnect');
        return ;
    }
    const socketG = new SocketManager(io, socket);
    listSocket.push(socket.id)
    io.on('disconnect', () => listSocket.splice(listSocket.indexOf(socket.id), 1));
});