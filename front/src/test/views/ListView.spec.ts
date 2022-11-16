import { shallowMount } from "@vue/test-utils";
import { describe, test, expect, beforeAll } from 'vitest';

import ListView from '@/views/ListView.vue';

describe('Test ListView', () => {
	// const router = {
	// 	path: '/list'
	// }

	test('Mount', () => {
		const wrapper = shallowMount(ListView);
		const button = wrapper.find('button');
		button.trigger('click');
		expect(button.exists()).toBe(true);
	})
})