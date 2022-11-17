import { shallowMount } from "@vue/test-utils";
import { describe, test, expect, beforeAll } from 'vitest';
import MockedSocket from 'socket.io-mock';

import CreateRoomView from '@/views/CreateRoomView.vue';
import { connectSocket } from "@/utils/socket";

describe('Create Room', () => {
	let sock: any;
	const roomNameTest = 'rOoM TeSt NaMe';

	beforeAll(() => {
		sock = new MockedSocket();
		connectSocket(sock.socketClient);
	})

	test('Mount', () => {
		sock.on('room/create', (data: {name:string, speed: number, sizeTerrain: {sizeRow: number, sizeColumn: number}}) => {
			expect(data.name).toBe(roomNameTest);
			expect(data.speed).toBe(100);
			expect(data.sizeTerrain).toStrictEqual({sizeRow: 20, sizeColumn: 10});
		})

		const wrapper = shallowMount(CreateRoomView);
		const inputName = wrapper.find('#input-room-name');
		const inputSpeed = wrapper.find('#input-speed');
		const button = wrapper.find('button');
		inputName.setValue(roomNameTest);
		expect((inputSpeed.element as HTMLInputElement).value).toBe('700')
		inputSpeed.setValue('725');
		expect((inputSpeed.element as HTMLInputElement).value).toBe('725')
		inputSpeed.trigger('keypress', { key: 'a' })
		inputSpeed.setValue('dsqd');
		expect((inputSpeed.element as HTMLInputElement).value).toBe('')
		button.trigger('click');
	})
})