<template>
	<div class="gameBox"
		:style="{
			width: sizeBlock * 12 + 'px',
			height: sizeBlock * 20 + 'px'
		}">
		<div class="line" v-if="isBorder">
			<div class="block border-game"></div>
			<div class="block border-game" v-for="(_, index) in terrain[0]" v-bind:key="index"></div>
			<div class="block border-game"></div>
		</div>

		<div class="line" v-for="(row, index) in terrain" v-bind:key="index" >
			<div class="block border-game" v-if="isBorder"></div>
			<div :class="`block color-${column}`" v-for="(column, index) in row" v-bind:key="index"></div>
			<div class="block border-game" v-if="isBorder"></div>
		</div>

		<div class="line" v-if="isBorder">
			<div class="block border-game"></div>
			<div class="block border-game" v-for="(_, index) in terrain[0]" v-bind:key="index"></div>
			<div class="block border-game"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	terrain: number[][],
	isBorder: boolean,
	sizeBlock: number,
}>();
</script>