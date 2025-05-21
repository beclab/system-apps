import { computed } from 'vue';
<template>
	<div
		class="gpu-status-container row inline justify-center items-center q-py-xs q-px-md"
		:class="[
			isExternal
				? 'bg-yellow-alpha text-yellow-default'
				: health
				? 'bg-green-alpha text-green-default'
				: 'bg-red-alpha text-red-default'
		]"
	>
		{{
			isExternal
				? $t('GPU.UNMANAGED')
				: health
				? $t('GPU.HEALTHY')
				: $t('GPU.HARDWARE_ERROR')
		}}
	</div>
</template>

<script setup lang="ts">
interface Props {
	health: boolean;
	isExternal: boolean;
}

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.gpu-status-container {
	border-radius: 4px;
}
</style>
