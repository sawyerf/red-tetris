import { Request, Response } from 'express';

const create = (req: Request, res: Response): void => {
	res.send('lel');
};

export default {
	create,
}