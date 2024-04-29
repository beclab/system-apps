<template>
	<div class="my-grid-container">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { computed, toRefs, ref } from 'vue';
import { getCssVar } from 'quasar';

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
}
const props = withDefaults(defineProps<Props>(), {
	colWidth: '160px',
	gap: 'md'
});

const { colWidth, gap } = toRefs(props);
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
</script>

<style lang="scss" scoped>
.my-grid-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(v-bind(colWidth), 1fr));
	grid-gap: v-bind(gapConputed);
}
</style>
