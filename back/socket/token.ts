import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

require('dotenv').config();

const secret: jwt.Secret = process.env.SECRET_JWT || v4();

export type TokenPayload = {
	username: string;
	idPlayer: string;
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

export default {
	checkToken,
	createToken,
}