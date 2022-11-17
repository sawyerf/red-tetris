import { shallowMount } from "@vue/test-utils";
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
			sock.emit('room/list', {
				rooms: [
					roomTest
				]
			})
		})
	})

	test('Mount List', () => {
		wrapper = shallowMount(ListRoom);

		sock.on('room/join', (data: {roomId: string}) => {
			expect(data.roomId).toBe(roomTest.uid);
		});
		expect(wrapper.find('.room-name').text()).toBe(roomTest.name);
		expect(wrapper.find('.room-player').text()).toBe(`${roomTest.numberPlayer}/${roomTest.maxPlayer}`);
		wrapper.find('.room-item').trigger('click');
	})
})