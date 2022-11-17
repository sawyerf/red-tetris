import { v4 } from "uuid";
import jwt from 'jsonwebtoken';

import Token from "../../socket/token";
import type { TokenPayload } from "../../socket/token";

describe('jwt Token', () => {
	let payload: TokenPayload = {
		username: 'desbarres',
		idPlayer: v4(),
		room: v4(),
		iat: Date.now(),
	};
	let tokenEncrypt:string = '';

	test('encrypt', (done) => {
		tokenEncrypt = Token.createToken(payload);
		expect(tokenEncrypt && tokenEncrypt != '').toBe(true);
		done()
	})

	test('verify', () => {
		expect(Token.checkToken(tokenEncrypt)).toStrictEqual(payload);
		expect(jwt.decode(tokenEncrypt)).toStrictEqual(payload);
	})

	test('False Verify', () => {
		const token: string = jwt.sign(payload, 'fakeSecret');

		expect(Token.checkToken(token)).toBe(false);
	})
})