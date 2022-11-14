import { shallowMount } from "@vue/test-utils";
import GameItem from '@/components/GameItem.vue';
import { createTerrain } from '@/utils/terrain';
import { describe, test, expect } from 'vitest';

describe("Game Item", () => {
    test("Mount Game", () => {
        const wrapper = shallowMount(GameItem, {
            propsData: {
                terrain: createTerrain(20, 10),
                isBorder: true,
                sizeWidth: '44vh',
                sizeHeight: '80vh'
            }
        });
        expect(wrapper.find('.block').exists()).toBe(true)
        expect(wrapper.find('.border-game').exists()).toBe(true)
    });

	test('Mount Empty', () => {
        const wrapper = shallowMount(GameItem, {
            propsData: {
                terrain: createTerrain(0, 0),
                isBorder: false,
                sizeWidth: '44vh',
                sizeHeight: '80vh'
            }
        });
        expect(wrapper.find('.block').exists()).toBe(false)
        expect(wrapper.find('.border-game').exists()).toBe(false)
	})
});