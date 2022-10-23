import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { Socket } from 'socket.io';

import { apiRouter } from './routes';
import { initSocket } from './socket/index'

config();

declare global {
	var io: Socket
}

const app: Application = express();

app.use('/api', apiRouter);

const server: Server = app.listen(3000);

const io: Socket = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

global.io = io;
initSocket(io)