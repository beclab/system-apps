<template>
	<div class="my-table-container">
		<table class="my-data-detail-table">
			<tr
				v-for="(value, key) in data"
				:key="key + value"
				class="table-wrapper bg-white"
			>
				<td class="first-td q-pl-lg q-pr-lg q-py-md">
					<div
						:style="{
							maxWidth: `${maxWidth}px`
						}"
					>
						{{ key }}
						<q-resize-observer @resize="onResize" />
					</div>
				</td>
				<td class="q-pr-lg q-pl-md q-py-md">
					<MyEllips :text="value"></MyEllips>
				</td>
			</tr>
		</table>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MyEllips from '../components/MyEllips.vue';
interface Props {
	data: { [key: string]: any };
}

const maxWidth = ref(200);
const size = ref({
	width: 200
});
const onResize = (size: { width: number; height: number }) => {
	size = size;
};
const props = withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.my-table-container {
	overflow-y: hidden;
}
.my-data-detail-table {
	overflow-wrap: anywhere;
	border-collapse: separate;
	border-spacing: 0 12px;
	margin: -12px 0;
	width: 100%;
	.first-td {
		vertical-align: baseline;
		max-width: 20%;
	}
	& tr.table-wrapper td:first-child {
		border-radius: 12px 0 0 12px;
		white-space: nowrap;
	}
	& tr.table-wrapper td:last-child {
		border-radius: 0 12px 12px 0;
	}
	.text-wrap {
		white-space: wrap;
	}
}
</style>
