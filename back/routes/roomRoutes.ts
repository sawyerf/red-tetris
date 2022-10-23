import { Router, Request, Response } from 'express';
import roomController from '../controllers/roomController';

export const roomRouter = Router();

roomRouter.get('/create', async (req: Request, res: Response) => roomController.create(req, res));