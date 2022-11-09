<template >
	<div class="home-main">
		<img class="logo" src="https://static.wikia.nocookie.net/logopedia/images/f/f8/Tetris_1997.svg" alt="logo" />
		<ListRoom></ListRoom>
		<button v-on:click="onClickCreate">Create Room</button>
	</div>
</template>

<script setup lang="ts">
import ListRoom from '@/components/ListRoom.vue';
import router from '@/utils/router';

const onClickCreate = () => {
	console.log('de')
	router.push('/create')
}
</script>