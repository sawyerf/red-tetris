<template>
	<div class="home-main">
		<input class="input-name" placeholder="Create Room" :value="roomName" @input="(event) => roomName = event.target.value" v-on:keyup.enter="onEnterRoom" />

		<input type="range">lol</input>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';
import { connectSocket } from '@/utils/socket';

const roomName: Ref<string | null> = ref('');
const io = connectSocket();

const onEnterRoom = () => {
	io.emit('room/create', { name: roomName.value });
}
</script>