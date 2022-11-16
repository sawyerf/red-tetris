import { shallowMount } from "@vue/test-utils";
import { describe, test, expect, beforeAll } from 'vitest';
import MockedSocket from 'socket.io-mock';

import CreateRoomView from '@/views/CreateRoomView.vue';
import { connectSocket } from "@/utils/socket";

describe('Create Room', () => {
	let sock: MockedSocket;
	const roomNameTest = 'rOoM TeSt NaMe';

	beforeAll(() => {
		sock = new MockedSocket();
		connectSocket(sock.socketClient);
	})

	test('Mount', () => {
		sock.on('room/create', (data: {name:string, speed: number, sizeTerrain: {sizeRow: number, sizeColumn: number}}) => {
			expect(data.name).toBe(roomNameTest);
			expect(data.speed).toBe(700);
			expect(data.sizeTerrain).toStrictEqual({sizeRow: 20, sizeColumn: 10});
		})

		const wrapper = shallowMount(CreateRoomView);
		const inputName = wrapper.find('#input-room-name');
		const button = wrapper.find('button');
		inputName.setValue(roomNameTest);
		button.trigger('click');
	})
})