import { Router } from 'express';
import { roomRouter } from './roomRoutes';

export const apiRouter = Router();

apiRouter.use('/room', roomRouter);