<template>
	<div class="row items-center justify-between">
		<div class="row items-center">
			<div class="parent-container bg-teal-2">
				<q-img :src="icon" :ratio="1" :width="iconWidth" />
			</div>
			<div class="text-h4 q-ml-lg text-ink-1">{{ value }}</div>
		</div>
		<div class="q-px-lg q-py-sm rounded-borders-lg" :class="trendClass">
			<q-icon :name="trendIcon" />
			<!-- <q-icon name="sym_r_trending_down" /> -->
			<span class="text-subtitle1 q-ml-sm">{{ trend }}{{ change || '' }}</span>
		</div>
	</div>
	<div class="text-subtitle1 text-ink-2 q-mt-lg">{{ subtile }} in 24 hours</div>
</template>

<script setup lang="ts">
import supervisorAccountIcon from 'assets/supervisor_account.svg';
import visibilityIcon from 'assets/visibility.svg';
import { computed } from 'vue';

interface Props {
	type: 'view' | 'visit';
	value: number;
	change: number;
}
const props = withDefaults(defineProps<Props>(), {
	type: 'view',
	value: 0
});

const icon = computed(() =>
	props.type === 'view' ? visibilityIcon : supervisorAccountIcon
);

const iconWidth = computed(() => (props.type === 'view' ? '28px' : '32px'));

const subtile = computed(() => (props.type === 'view' ? 'Views' : 'Visitors'));
const trend = computed(() => (props.change > 0 ? '+' : ''));
const trendIcon = computed(() =>
	props.change > 0
		? 'sym_r_trending_up'
		: props.change < 0
		? 'sym_r_trending_down'
		: ''
);
const trendClass = computed(() =>
	props.change > 0
		? 'text-positive bg-green-soft'
		: props.change < 0
		? 'text-negative bg-red-soft'
		: ''
);
</script>

<style lang="scss" scoped>
.parent-container {
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px !important;
	overflow: hidden;
}
</style>
