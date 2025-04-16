<template>
	<div class="adaptive-table">
		<table>
			<tbody>
				<tr v-for="(row, index) in formattedRows" :key="index">
					<td
						v-for="(item, cellIndex) in row"
						:key="cellIndex"
						class="table-cell"
					>
						{{ item }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: 'AdaptiveTable',
	props: {
		items: {
			type: Array,
			required: true
		},
		minColumnWidth: {
			type: Number,
			default: 200 // 每列最小宽度（像素）
		}
	},
	data() {
		return {
			containerWidth: 0,
			observer: null
		};
	},
	computed: {
		columnsCount() {
			if (!this.containerWidth) return 1;
			const maxColumns = Math.floor(this.containerWidth / this.minColumnWidth);
			return Math.max(1, Math.min(maxColumns, 3)); // 最多3列
		},
		formattedRows() {
			const result = [];
			for (let i = 0; i < this.items.length; i += this.columnsCount) {
				result.push(this.items.slice(i, i + this.columnsCount));
			}
			return result;
		}
	},
	mounted() {
		this.observer = new ResizeObserver(this.updateContainerWidth);
		this.observer.observe(this.$el);
		this.updateContainerWidth();
	},
	beforeUnmount() {
		if (this.observer) {
			this.observer.disconnect();
		}
	},
	methods: {
		updateContainerWidth() {
			this.containerWidth = this.$el.getBoundingClientRect().width;
		}
	}
};
</script>

<style scoped>
.adaptive-table {
	width: 100%;
}

table {
	width: 100%;
	border-collapse: collapse;
}

.table-cell {
	padding: 12px;
	border: 1px solid #eee;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
