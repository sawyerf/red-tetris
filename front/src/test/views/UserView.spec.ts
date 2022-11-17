import { shallowMount } from "@vue/test-utils";
import { describe, test, expect, beforeAll } from 'vitest';
import MockedSocket from 'socket.io-mock';

import UserView from '@/views/UserView.vue';
import { connectSocket } from "@/utils/socket";
import router from "@/utils/router";

describe('UsersView',  () => {
	let sock: any;
	const nameTest = 'TeSt NaMe';

	beforeAll(() => {
		sock = new MockedSocket();
		connectSocket(sock.socketClient);
	})

	test('Mount', async () => {
		sock.on('user/setname', (data: {name: string}) => {
			expect(data.name).toBe(nameTest);
		})
		sock.on('room/join', (data: {roomId: string}) => {
			expect(data.roomId).toBe('lol');
		})
		await router.replace('/#lol[lel]')
		const wrapper = shallowMount(UserView);
		const inputName = wrapper.find('.input-name');
		const button = wrapper.find('button');
	
		inputName.setValue(nameTest)
		inputName.trigger('keyup', {
			key: 'enter'
		})
		button.trigger('click');
	})
})