<template>
	<div class="relative-position" style="overflow: hidden">
		<MenuHeader
			style="position: absolute; top: 0"
			class="text-left"
		></MenuHeader>
		<MyContentPage>
			<router-view></router-view>
		</MyContentPage>
	</div>
</template>

<script lang="ts" setup>
import MenuHeader from 'src/layouts/MenuHeader.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
</script>

<style lang="scss" scoped></style>
