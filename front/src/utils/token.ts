import jwt_decode from "jwt-decode";

export type TokenPayload = {
	username: string;
	indexPlayer: number;
	room: string;
	iat: number;
}

const get = (): TokenPayload | null  => {
	const token: string | null = localStorage.getItem('token');
	if (!token) return null;
	console.log(token);
	const verified = jwt_decode(token);
	return verified as TokenPayload;
}

const getRaw = (): string | null  => {
	return localStorage.getItem('token');
}

const save = (newToken: string) => {
	localStorage.setItem('token', newToken);
}

export default {
	save,
	get,
	getRaw,
}