import { describe, test, expect, beforeAll } from 'vitest';
import { createTerrain } from '@/utils/terrain';


describe('Terrain', () => {
	test('Create Terrain', () => {
		const terrain: number[][] = createTerrain(10, 20);

		expect(terrain.length).toBe(20);
		expect(terrain[0].length).toBe(10);
	})
})