<template >
	<p>home</p>
	<div style="text-align: center;">
		<img src="https://static.wikia.nocookie.net/logopedia/images/f/f8/Tetris_1997.svg" alt="logo" />
	</div>
	<ListRoom></ListRoom>
	<input :value="name" @input="keyHandler" v-on:keyup.enter="onEnter" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { Ref } from 'vue';
import ListRoom from '@/components/ListRoom.vue';
import type { Socket } from 'engine.io-client';
import { connectSocket } from '@/utils/socket';

const name: Ref<string | null> = ref('');
const io = connectSocket();

const keyHandler = (event: Event) => {
	name.value += event.data;
}

const onEnter = () => {
	io.emit('user/setname', { name: name.value });
}

</script>