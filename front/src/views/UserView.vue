<template>
	<div class="home-main">
		<img class="logo" src="https://static.wikia.nocookie.net/logopedia/images/f/f8/Tetris_1997.svg" alt="logo" />
		<input class="input-name" :value="userName" @input="(event) => userName = event.target.value" v-on:keyup.enter="onEnterName" placeholder="name"/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { connectSocket } from '@/utils/socket';

const io = connectSocket();
const userName: Ref<string | null> = ref('');

const onEnterName = () => {
	io.emit('user/setname', { name: userName.value });
}

</script>