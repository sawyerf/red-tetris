<template>
  <main>
	<!-- <img class="logo" src="https://static.wikia.nocookie.net/logopedia/images/f/f8/Tetris_1997.svg" alt="logo" /> -->
	<div class="game-main">
		<div class="opponents">
			<div class="opponent" v-for="(competitor, index) in competitors" v-bind:key="index" >
				<p class="opponent">{{competitor?.name}}</p>
				<GameItem :terrain=competitor?.terrain :is-border=false :size-width="'11vh'" :size-height="'22vh'"/>
				<p class="opponent">{{competitor?.score}}</p>
			</div>
		</div>
		<div class="myTerrain">
			<GameItem :terrain=terrain :is-border=true :size-width="'44vh'" :size-height="'80vh'" />
		</div>
		<div class="info-game">
			<p class="info-game"> {{score}} pts </p>
			<div class="piece-info">
				<GameItem style="margin-bottom: 2.1vh; border: solid white 1px;" :terrain=nextPiece :is-border=false :size-width="'15vh'" :size-height="'15vh'" />
				<GameItem style="border: solid white 1px;" :terrain=currentPiece :is-border=false :size-width="'15vh'" :size-height="'15vh'" />
			</div>
		</div>
	</div>
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
const score: Ref<number> = ref(0);
const competitors: Ref<Competitor[]> = ref(new Array());
const io = connectSocket();
const currentPiece: Ref<number[][]> = ref(createTerrain(3, 3));
const nextPiece: Ref<number[][]> = ref(createTerrain(3, 3));

io.on('game/pieces', (data: {currentPiece: number[][], nextPiece: number[][]}) => {
	currentPiece.value = data.currentPiece;
	nextPiece.value = data.nextPiece;
})

io.on('game/oponent', (data: { username: string, idPlayer: number, terrain: number[][], score: number }) => {
	// const index:number = competitors.value.find((item))
	competitors.value[data.idPlayer] = {
			name: data.username,
			score: data.score,
			terrain: data.terrain,
		};
	console.log('competitor: ', competitors.value);
});

io.on('game/terrain', (data: { terrain: number[][], score: number }) => {
	terrain.value = data.terrain;
	score.value = data.score;
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
