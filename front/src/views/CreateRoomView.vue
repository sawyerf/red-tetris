<template>
	<div class="home-main" style="opacity: 0.25">
		<GameItem :terrain=terrain :isBorder=true :sizeWidth=calcSizeWidth(sizeTerrain) :sizeHeight="'80vh'"></GameItem>
	</div>
	<div class="home-main create">
		<p class="create"> Name Room </p>
		<input id="input-room-name" placeholder="Create Room" :value="roomName"
			@input="(event: Event) => roomName = event?.target?.value" v-on:keyup.enter="onEnterRoom" autofocus/>

		<p class="create"> Speed Gravity </p>
		<input type="number" placeholder="Speed" v-model.number="speed"
			@input="inputSpeed" @keypress="isNumber">

		<p class="create"> Size Terrain </p>
		<select v-model="sizeTerrain">
			<option :value="{ sizeRow: 20, sizeColumn: 15 }">20x15</option>
			<option :value="{ sizeRow: 20, sizeColumn: 10 }">20x10 (default)</option>
			<option :value="{ sizeRow: 15, sizeColumn: 10 }">15x10</option>
			<option :value="{ sizeRow: 10, sizeColumn: 5 }">10x5</option>
		</select>
		<button style="margin-top: 30px;" v-on:click="onClickCreate"> Create </button>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { connectSocket } from '@/utils/socket';
import GameItem from '@/components/GameItem.vue';
import { createTerrain } from '@/utils/terrain';

const roomName: Ref<string | null> = ref('');
const terrain: Ref<number[][]> = ref(createTerrain(10, 20));
const sizeTerrain: Ref<{ sizeRow: number, sizeColumn: number }> = ref({ sizeRow: 20, sizeColumn: 10 });
const speed: Ref<number> = ref(700);
const io = connectSocket();

const isNumber = (evt: KeyboardEvent): void => {
	const keysAllowed: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	const keyPressed: string = evt.key;

	if (!keysAllowed.includes(keyPressed)) {
		evt.preventDefault()
	}
}

const inputSpeed = (event: Event) => {
	if (speed.value > 1000) speed.value = 1000
}

const calcSizeWidth = (size: any): string => {
	const sizeWidth = (80 * (size.sizeColumn + 2)) / (size.sizeRow + 2);
	return `${sizeWidth}vh`
}

watch(sizeTerrain, (size) => {
	terrain.value = createTerrain(size.sizeColumn, size.sizeRow)
})

const onClickCreate = () => {
	let speedRet = Number(speed.value);

	if (speedRet > 1000) speedRet = 1000;
	if (speedRet < 100) speedRet = 100;
	io.emit('room/create', {
		name: roomName.value,
		speed: speedRet,
		sizeTerrain: sizeTerrain.value,
	});
}
</script>