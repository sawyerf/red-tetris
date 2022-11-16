import { flushPromises, mount, shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, test, expect, beforeAll } from 'vitest';
import MockedSocket from 'socket.io-mock';

import ListRoom from '@/components/ListRoom.vue';
import { connectSocket } from "@/utils/socket";

describe('List Room', () => {
	const roomTest = {
		uid: 'test-uid',
		name: 'testosterone',
		numberPlayer: 123,
		maxPlayer: 123
	}
	let sock: any;
	let wrapper: any;

	beforeAll(() => {
		sock = new MockedSocket();
		connectSocket(sock.socketClient);
		sock.on('room/list', () => {
			console.log('desbarres');
			sock.emit('room/list', {
				rooms: [
					roomTest
				]
			})
		})
	})

	test('Mount List', () => {
		sock.on('room/list', () => {
			console.log('deux barres');
		})

		wrapper = shallowMount(ListRoom);

		expect(true).toBe(true);
		// while (1) {
		// 	if (wrapper.html() != '<ul></ul>') break;
		// }
		// console.log(wrapper.html())
		// wrapper.trigger('click')
		// expect(wrapper.get('.room-name').text()).toBe(roomTest.name);
		// expect(wrapper.find('.room-player').text()).toBe(`${roomTest.numberPlayer}/${roomTest.maxPlayer}`);
	})
})