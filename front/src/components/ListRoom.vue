<template>
	<ul>
		<li class="room-item" v-for="room of listRoom" :key="room.uid" @click="() => joinHandle(room.uid)" >
			<p class="room-name">{{room.name}}</p> <p class="room-player">{{room.numberPlayer}}/{{room.maxPlayer}}</p>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { connectSocket } from '@/utils/socket';
import { onBeforeMount, onUnmounted, ref } from 'vue';
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

onBeforeMount(() => {
	io.on('room/list', (data: {rooms: roomType[]}) => {
		listRoom.value = data.rooms;
	});
	io.emit('room/list');
})

onUnmounted(() => {
	io.off('room/list');
})
</script>