<template>
	<div class="home-main">
		<img class="logo" src="https://static.wikia.nocookie.net/logopedia/images/f/f8/Tetris_1997.svg" alt="logo" />
		<input class="input-name" :value="userName" @input="(event) => userName = event?.target?.value" @keyup.enter="onEnterName" placeholder="name"/>
		<button v-if="isJoin()" @click="joinGame()" style="margin-top: 25px"> Join </button>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import type { Ref } from 'vue';

import { connectSocket } from '@/utils/socket';
import router from '@/utils/router';
import Token from '@/utils/token';

const io = connectSocket();
const userName: Ref<string | null> = ref('');

onBeforeMount(() => {
	const token = Token.get();
	if (token) {
		userName.value = token.username;
	}
})

const isJoin = (): boolean => {
	if (router.currentRoute.value.hash.match(/#.+?\[.+?\]/)) {
		return true;
	}
	return false;
}

const joinGame = () => {
	const token = Token.get();
	const hashRegex = router.currentRoute.value.hash.match(/#(.+?)\[.+?\]/);
	if (userName.value == '') return ;
	if (token && token.username != userName.value) {
		onEnterName();
	}
	if (hashRegex?.length == 2) {
		io.emit('room/join', {roomId: hashRegex[1]})
		router.replace('/')
	}
}

const onEnterName = () => {
	io.emit('user/setname', { name: userName.value });
}

</script>