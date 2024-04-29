<template>
	<q-img
		class="rounded-borders-sm title-img my-avatar-img"
		fit="contain"
		:width="'32px'"
		:height="'32px'"
		spinner-size="sm"
		spinner-color="grey-1"
		loading="lazy"
		:src="src"
		v-bind="$attrs"
	>
		<template #loading>
			<q-skeleton type="rect" class="full-width full-height" />
		</template>
	</q-img>
</template>

<script setup lang="ts">
interface Props {
	src?: string;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.my-avatar-img {
	box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
}
</style>
