<template>
	<q-chip
		:color="isExternal ? 'warning' : health ? 'positive' : 'negative'"
		text-color="white"
		dense
		square
	>
		{{
			isExternal
				? $t('GPU.UNMANAGED')
				: health
				? $t('GPU.HEALTHY')
				: $t('GPU.HARDWARE_ERROR')
		}}
	</q-chip>
</template>

<script setup lang="ts">
interface Props {
	health: boolean;
	isExternal: boolean;
}

defineProps<Props>();
</script>

<style></style>
