<template>
	<div class="gameBox">
    <!-- <div style="background-color: grey"> -->
		<div class="line">
			<div class="block border-game"></div>
			<div class="block border-game" v-for="(_, index) in  terrain[0]" v-bind:key="index"></div>
			<div class="block border-game"></div>
		</div>

		<div class="line" v-for="(row, index) in terrain" v-bind:key="index" >
			<div class="block border-game"></div>
			<div :class="`block color-${column}`" v-for="(column, index) in row" v-bind:key="index"></div>
			<div class="block border-game"></div>
		</div>

		<div class="line">
			<div class="block border-game"></div>
			<div class="block border-game" v-for="(_, index) in  terrain[0]" v-bind:key="index"></div>
			<div class="block border-game"></div>
		</div>
	</div>
	<button @click="terrain[19].fill(1)">Line 1</button>
    <button @click="terrain[18].fill(1)">Line 2</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { connectSocket } from '@/socket';


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

io.on('terrain', (data) => {
	// for (let indexRow = 0; indexRow < terrain.value.length; indexRow++) {
	// 	for (let indexColumn = 0; indexColumn < terrain.value[indexRow].length; indexColumn++) {
	// 		if (terrain.value[indexRow][indexColumn] != data.terrain[indexRow][indexColumn]) {
	// 			console.log(indexColumn, indexRow);
	// 			terrain.value[indexRow][indexColumn] = data.terrain[indexRow][indexColumn];
	// 		}
	// 	}
	// }
	terrain.value = data.terrain;
});

document.body.addEventListener('keydown', (event) => {
	// console.log(event);
	if (['Enter',  'ArrowDown',  'ArrowUp',  'ArrowRight',  'ArrowLeft',  ' '].indexOf(event.key) > -1) {
		io.emit('key', { key: event.key });
		console.log('key');
	}
});

</script>