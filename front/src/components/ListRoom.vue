<template>
	<ul>
		<li v-on:click="() => joinHandle(room.uid)" class="room-item" v-for="(room, index) in listRoom" v-bind:key="index">
			<p class="room-name">{{room.name}}</p> <p class="room-player">{{room.numberPlayer}}/{{room.maxPlayer}}</p>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { connectSocket } from '@/utils/socket';
import { onMounted, onUnmounted, ref } from 'vue';

const io = connectSocket();
const listRoom = ref();

const joinHandle = (room: {roomId: number}) => {
	io.emit('room/join', {roomId: room})
}

onMounted(() => {
	io.emit('room/list');
	console.log('ici');
	io.on('room/list', (data) => {
		console.log('enfiiiiiiin');
		listRoom.value = data.rooms;
	});
})

onUnmounted(() => {
	io.off('room/list');
})
</script>