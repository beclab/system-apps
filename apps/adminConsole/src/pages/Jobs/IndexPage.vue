<template>
	<div class="relative-position" style="height: calc(100vh - 56px)">
		<MenuHeader></MenuHeader>
		<Empty center size="large"></Empty>
	</div>
</template>

<script setup lang="ts">
import MyContentPage from 'components/MyContentPage.vue';
import MenuHeader from 'src/layouts/MenuHeader.vue';
import Empty from '@packages/ui/src/components/Empty.vue';
</script>

<style></style>
