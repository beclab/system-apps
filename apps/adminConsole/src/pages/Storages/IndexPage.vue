<template>
	<div class="relative-position">
		<MenuHeader size="xxl"></MenuHeader>
		<bt-scroll-area style="height: calc(100vh - 56px)">
			<div class="relative-position q-px-xxl q-py-lg">
				<PersistentVolumeClaim></PersistentVolumeClaim>
			</div>
		</bt-scroll-area>
	</div>
</template>

<script setup lang="ts">
import MyContentPage from 'src/components/MyContentPage.vue';
import MenuHeader from 'src/layouts/MenuHeader.vue';
import Empty from '@packages/ui/src/components/Empty.vue';
import PersistentVolumeClaim from './PersistentVolumeClaim.vue';
</script>

<style></style>
