<template >
	<div class="home-main">
		<img class="logo" src="https://static.wikia.nocookie.net/logopedia/images/f/f8/Tetris_1997.svg" alt="logo" />
		<ListRoom></ListRoom>
		<input class="input-name" placeholder="Create Room" :value="roomName" @input="(event) => roomName = event.target.value" v-on:keyup.enter="onEnterRoom" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import ListRoom from '@/components/ListRoom.vue';
import { connectSocket } from '@/utils/socket';

const roomName: Ref<string | null> = ref('');
const io = connectSocket();

const onEnterRoom = () => {
	io.emit('room/create', {name: roomName.value});
}


</script>