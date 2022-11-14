import { shallowMount } from "@vue/test-utils";
import { describe, test, expect, beforeAll } from 'vitest';
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import ListRoom from '@/components/ListRoom.vue'
import { connectSocket } from "@/utils/socket";

describe('List Room', () => {
	let io: Server;
	const roomTest = {
		uid: 'test-uid',
		name: 'testosterone',
		numberPlayer: 123,
		maxPlayer: 123
	}

			// sock.on('room/list', () => {
			// 	console.log('desbarres');
			// 	sock.emit('room/list', {
			// 		rooms: [
			// 			roomTest
			// 		]
			// 	})
			// })

	test('Mount List', () => {
		const wrapper = shallowMount(ListRoom);

		console.log('lol', wrapper.text());
		expect(wrapper.find('.room-name').text()).toBe(roomTest.name);
		expect(wrapper.find('.room-player').text()).toBe(`${roomTest.numberPlayer}/${roomTest.maxPlayer}`);
	})
})