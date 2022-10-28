<template>
	<p>list</p>
	<ul>
		<li class="room-item" v-for="(room, index) in listRoom" v-bind:key="index">
			<p class="room-name">{{room.name}}</p> <p class="room-player">{{room.numberPlayer}}/{{room.maxPlayer}}</p>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { connectSocket } from '@/utils/socket';
import { ref } from 'vue';

const io = connectSocket();
const listRoom = ref();

io.on('room/list', (data) => {
	listRoom.value = data.rooms;
});
</script>