import Token from "@/utils/token";
import { TokenPayload } from "@/utils/token";
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { describe, test, expect, beforeAll } from 'vitest';

describe('Token', () => {
	const payload: TokenPayload = {
		username: 'testo',
		idPlayer: 'fake-id',
		room: 'foka-ido',
		iat: 123
	}

	test('Decrypt', () => {
		const fakeToken = jwt.sign(payload, 'fake-secret');

		expect(Token.get()).toBe(null)
		Token.save(fakeToken);
		expect(Token.getRaw()).toBe(fakeToken)
		expect(Token.get()).toStrictEqual(payload)
	})
})