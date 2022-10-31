<template>
  <main>
	<div class="opponents">
		<GameItem v-for="(competitor, index) in competitors" v-bind:key="index" :terrain=competitor?.terrain :is-border=false :size-block="10"/>
	</div>
    <GameItem  :terrain=terrain :is-border=true :size-block="30" />
  </main>
</template>

<script setup lang="ts">
import GameItem from '../components/GameItem.vue';
import { connectSocket } from '@/utils/socket';
import { ref } from 'vue';
import type { Ref } from 'vue';
import Token from '@/utils/token';

const createTerrain = (column: number, row: number): number[][] => {
	let terrain: number[][] = new Array(row);
	row--;
	for (; row >= 0; row--) {
		terrain[row] = new Array(column);
		terrain[row].fill(0);
	}
	return terrain;
}

type Competitor = {
	name: string,
	score: number,
	terrain: number[][],
};

const terrain: Ref<number[][]> = ref(createTerrain(10, 20));
const competitors: Ref<Competitor[]> = ref(new Array());
const myIndex: number = Token.get()?.indexPlayer || 0;
const io = connectSocket();

io.on('game/terrain', (data: { username: string, idPlayer: number, terrain: number[][] }) => {
	if (data.idPlayer == myIndex) {
		terrain.value = data.terrain;
	} else {
		competitors.value[data.idPlayer] = {
			name: data.username,
			score: 0,
			terrain: data.terrain,
		};
	}
	console.log('competitor: ', competitors.value)
});

document.body.addEventListener('keydown', (event) => {
	if (['Enter',  'ArrowDown',  'ArrowUp',  'ArrowRight',  'ArrowLeft',  ' '].indexOf(event.key) > -1) {
		io.emit('game/key', { key: event.key });
		console.log('key');
	}
	if (event.key == 'Escape') {
		io.emit('room/leave');
	}
});

</script>
