<template>
  <main>
    <GameItem :terrain=terrain :is-border=true />
  </main>
</template>

<script setup lang="ts">
import GameItem from '../components/GameItem.vue';
import { connectSocket } from '@/utils/socket';
import { ref } from 'vue';
import type { Ref } from 'vue';

const createTerrain = (column: number, row: number): number[][] => {
	let terrain: number[][] = new Array(row);
	row--;
	for (; row >= 0; row--) {
		terrain[row] = new Array(column);
		terrain[row].fill(0);
	}
	return terrain;
}

const terrain: Ref<number[][]> = ref(createTerrain(10, 20));
const io = connectSocket();

io.on('game/terrain', (data) => {
	terrain.value = data.terrain;
});

document.body.addEventListener('keydown', (event) => {
	if (['Enter',  'ArrowDown',  'ArrowUp',  'ArrowRight',  'ArrowLeft',  ' '].indexOf(event.key) > -1) {
		io.emit('game/key', { key: event.key });
		console.log('key');
	}
	if (event.key == 'a') io.emit('room/create', {name: 'desbarres'});
});

</script>
