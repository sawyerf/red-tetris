<template>
  <main>
	<!-- <img class="logo" src="https://static.wikia.nocookie.net/logopedia/images/f/f8/Tetris_1997.svg" alt="logo" /> -->
	<div class="game-main">
		<div v-if="competitors.length" class="opponents">
			<div class="opponent" v-for="(competitor, index) in competitors" :key="index" >
				<p class="opponent">{{competitor?.name}}</p>
				<GameItem :terrain=competitor?.terrain :is-border=false :size-width=calcSizeWidth(competitor?.terrain,22) :size-height="'22vh'"/>
				<p class="opponent">{{competitor?.score}}</p>
			</div>
		</div>
		<div v-else class="info-players-game">
			<p class="info-players-game">{{infoPlayer.numberPlayer}}</p>
			<p class="info-players-game" v-for="(name, index) in infoPlayer.names" :key="index"> {{name}}</p>
		</div>
		<div class="myTerrain">
			<GameItem :terrain=terrain :is-border=true :size-width=calcSizeWidth(terrain,80) :size-height="'80vh'" />
		</div>
		<div class="info-game">
			<p class="info-game"> {{score}} pts </p>
			<p class="info-invit" @click="getLink"></p>
			<p class="info-text"> {{ infoText }} </p>
			<div class="piece-info">
				<GameItem style="margin-bottom: 2.1vh; border: solid white 1px;" :terrain=nextPiece :is-border=false :size-width="'15vh'" :size-height="'15vh'" />
				<GameItem style="border: solid white 1px;" :terrain=currentPiece :is-border=false :size-width="'15vh'" :size-height="'15vh'" />
			</div>
		</div>
	</div>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import type { Ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import GameItem from '../components/GameItem.vue';
import Token from '@/utils/token';
import { connectSocket } from '@/utils/socket';
import { createTerrain } from '@/utils/terrain'

type Competitor = {
	name: string,
	idPlayer: string,
	score: number,
	terrain: number[][],
};

const terrain: Ref<number[][]> = ref(createTerrain(10, 20));
const currentPiece: Ref<number[][]> = ref(createTerrain(3, 3));
const nextPiece: Ref<number[][]> = ref(createTerrain(3, 3));
const infoText: Ref<string> = ref('');
const score: Ref<number> = ref(0);
const competitors: Ref<Competitor[]> = ref(new Array());
const infoPlayer: Ref<{numberPlayer: string, names: string[]}> = ref({numberPlayer: '0 / 6', names: []});
const io = connectSocket();


onBeforeRouteLeave((to: any, from: any) => {
	io.emit('room/leave');
})


const calcSizeWidth = (terrainCalc: number[][], sizeHeight: number): string => {
	const sizeColumn = terrainCalc[0]?.length;
	const sizeRow = terrainCalc?.length;
	const sizeWidth = (sizeHeight * (sizeColumn + 2)) / (sizeRow + 2);

	return `${sizeWidth}vh`
}

const socketOn = () => {
	io.on('game/pieces', (data: {currentPiece: number[][], nextPiece: number[][]}) => {
		currentPiece.value = data.currentPiece;
		nextPiece.value = data.nextPiece;
		infoText.value = '';
	})
	
	io.on('game/oponent', (data: { username: string, idPlayer: string, terrain: number[][], score: number }) => {
		const comp = competitors.value.find((item) => item.idPlayer == data.idPlayer);
		const newComp = {
			idPlayer: data.idPlayer,
			name: data.username,
			score: data.score,
			terrain: data.terrain,
		};
		if (comp){
			competitors.value[competitors.value.indexOf(comp)] = newComp;
		} else {
			competitors.value.push(newComp);
		}
	});
	
	io.on('game/terrain', (data: { terrain: number[][], score: number }) => {
		terrain.value = data.terrain;
		score.value = data.score;
	});

	io.on('room/players', (data: {numberPlayer: string, names: string[]}) => {
		infoPlayer.value = data;
		competitors.value = [];
	})

	io.on('game/end', (data) => {
		infoText.value = `${data.winnerName} win with ${data.score} pts`
	})
}

const socketOff = () => {
	io.off('game/terrain');
	io.off('game/pieces');
	io.off('game/oponent');
	io.off('game/end');
	io.off('room/players');
}

const keyHandler = (event: KeyboardEvent) => {
	if (['Enter',  'ArrowDown',  'ArrowUp',  'ArrowRight',  'ArrowLeft',  ' '].indexOf(event.key) > -1) {
		io.emit('game/key', { key: event.key });
	}
	if (event.key == 'Escape') {
		io.emit('room/leave');
	}
};

const getLink = () => {
	const token = Token.get();

	if (token) {
		const url = `${location.protocol}//${location.host}/#${token.room}[${token.username}]`
		navigator.clipboard?.writeText(url);
		console.log(url)
	}
}

onBeforeMount(() => {
	document.body.addEventListener('keydown', keyHandler);
	socketOn();
	io.emit('room/getPlayers');
	io.once('connect', () => io.emit('room/getPlayers'));
})

onUnmounted(() => {
	document.body.removeEventListener('keydown', keyHandler);
	socketOff();
})
</script>
