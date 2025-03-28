<template>
	<div
		class="env-table-header header-row text-ink-3 text-body3 row items-center justify-between"
	>
		<div v-for="column in columns" :key="column.name">{{ column.label }}</div>
	</div>

	<div
		class="env-table-header body-row text-ink-1 text-subtitle2 row items-center justify-between"
		v-for="item in data"
		:key="item.key"
	>
		<div>{{ item.key }}</div>
		<div>{{ item.value }}</div>
		<div>
			<slot name="body-cell-actions" :props="item" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';

interface ColumnsType {
	name: string;
	label: string;
	align: 'left' | 'right' | 'center';
}

defineProps({
	columns: {
		type: Array as PropType<ColumnsType[]>,
		required: true
	},
	data: {
		type: Array as PropType<any[]>,
		required: false,
		default: () => []
	}
});
</script>

<style lang="scss" scoped>
.header-row {
	height: 36px;
	padding: 0 12px;
	border-bottom: 1px solid $input-stroke;
}

.body-row {
	height: 64px;
	padding: 0 12px;
	border-bottom: 1px solid $input-stroke;

	&:hover {
		background-color: rgba($color: #000000, $alpha: 0.05);
	}
}
</style>
