<template>
	<q-layout>
		<q-page-container>
			<bt-scroll-area id="my-scroll-wrapper" style="height: calc(100vh)">
				<router-view />
			</bt-scroll-area>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts" setup>
import { useSplitMenu } from '@packages/ui/src/stores/menu';

const SplitMenu = useSplitMenu();
SplitMenu.type = 'node';
</script>

<style lang="scss" scoped></style>
