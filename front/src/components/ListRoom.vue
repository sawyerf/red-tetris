<template>
	<ul>
		<li class="room-item" v-for="(room, index) in listRoom" v-bind:key="room.uid" v-on:click="() => joinHandle(room.uid)" >
			<p class="room-name">{{room.name}}</p> <p class="room-player">{{room.numberPlayer}}/{{room.maxPlayer}}</p>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { connectSocket } from '@/utils/socket';
import { onMounted, onUnmounted, ref } from 'vue';
import type { Ref } from 'vue';

type roomType = {
	uid: string,
	name: string,
	numberPlayer: number,
	maxPlayer: number
}
const io = connectSocket();
const listRoom: Ref<roomType[]> = ref([]);

const joinHandle = (room: string) => {
	io.emit('room/join', {roomId: room})
}

onMounted(() => {
	io.on('room/list', (data: {rooms: roomType[]}) => {
		console.log('enfiiiiiiin');
		listRoom.value = data.rooms;
		console.log('ici paris', listRoom.value)
	});
	io.emit('room/list');
	console.log('fin mount');
})

onUnmounted(() => {
	io.off('room/list');
})
console.log('abababab')
</script>