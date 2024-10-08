<template>
	<div class="my-grid-container" ref="gridContainerRef">
		<slot></slot>
		<div v-for="item in fillCount" :key="item"></div>
	</div>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, onBeforeUpdate, nextTick } from 'vue';
import { getCssVar } from 'quasar';
import { isNil } from 'lodash';

interface Props {
	/**
	 * min width(px) to split items
	 * @param col-width string(px)
	 */
	colWidth: string;
	/**
	 * item gap
	 */
	gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	contentLength?: number;
}
const props = withDefaults(defineProps<Props>(), {
	colWidth: '160px',
	gap: 'md'
});

const { colWidth, gap, contentLength } = toRefs(props);
const gridContainerRef = ref();
const gapConputed = computed(() => {
	switch (gap.value) {
		case 'xs':
			return '4px';
		case 'sm':
			return '8px';
		case 'md':
			return '12px';
		case 'lg':
			return '20px';
		case 'xl':
			return '32px';
		default:
			return '12px';
	}
});
const fillCount = ref(0);

onBeforeUpdate(() => {
	if (gridContainerRef.value && !isNil(contentLength.value)) {
		const containerWidth = gridContainerRef.value?.clientWidth ?? 0;
		const itemLength = contentLength.value ?? 0;
		const itemWidth = Number(colWidth.value.replace('px', ''));
		const gapWidth = Number(gapConputed.value.replace('px', ''));
		const rowLength = Math.floor(
			(containerWidth - gapWidth) / (itemWidth + gapWidth)
		);
		fillCount.value = Math.max(0, rowLength - itemLength);
	}
});
</script>

<style lang="scss" scoped>
.my-grid-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(v-bind(colWidth), 1fr));
	grid-gap: v-bind(gapConputed);
}
</style>
