import { shallowMount } from "@vue/test-utils";
import { describe, test, expect, beforeAll } from 'vitest';
import MockedSocket from 'socket.io-mock';

import UserView from '@/views/UserView.vue';
import { connectSocket } from "@/utils/socket";

describe('UsersView',  () => {
	let sock: any;
	const nameTest = 'TeSt NaMe';

	beforeAll(() => {
		sock = new MockedSocket();
		connectSocket(sock.socketClient);
	})

	test('Mount', () => {
		sock.on('user/setname', (data: {name: string}) => {
			expect(data.name).toBe(nameTest);
		})
		const wrapper = shallowMount(UserView);
		const inputName = wrapper.find('.input-name');
	
		inputName.setValue(nameTest)
		inputName.trigger('keyup', {
			key: 'enter'
		})
	})
})