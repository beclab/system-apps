<template>
	<div class="bg-white">
		<div
			class="my-table-container"
			:class="[
				stickyFirst ? 'first-sticky' : '',
				stickyLast ? 'last-sticky' : ''
			]"
		>
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

interface Props {
	stickyFirst: boolean;
	stickyLast: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const { stickyFirst, stickyLast } = toRefs(props);
</script>

<style lang="scss" scoped>
.my-table-container {
	::v-deep(.q-table__container thead) {
		color: #b2b0af;
		font-size: 12px;
		font-style: normal;
		font-weight: 400;
		line-height: 16px;
		background: #fff;
	}
	::v-deep(td) {
		padding: 20px 20px 20px 0;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 20px;
		color: $grey-10;
	}
	::v-deep(th) {
		padding: 20px 20px 20px 0;
	}
	::v-deep(.q-table th.sorted .q-table__sort-icon) {
		color: $grey-5;
	}
	::v-deep(.q-table__card .q-table__bottom) {
		font-size: 12px;
		color: $grey-5;
		border-top: 0 solid;
		padding-right: 0;
	}
	::v-deep(
			.q-table__container.q-table--horizontal-separator tbody tr:last-child > td
		) {
		border-bottom-width: 1px;
	}
}
</style>

<style lang="scss" scoped>
.first-sticky {
	::v-deep(thead tr:first-child th:first-child) {
		background-color: #fff;
	}

	::v-deep(td) {
		background-color: #fff;
	}

	::v-deep(th) {
		background-color: #fff;
	}

	::v-deep(th:first-child) {
		position: sticky;
		left: 0;
		z-index: 1;
	}
	::v-deep(td:first-child) {
		position: sticky;
		left: 0;
		z-index: 1;
	}
}

.last-sticky {
	::v-deep(thead tr:first-child th:first-child) {
		background-color: #fff;
	}

	::v-deep(td) {
		background-color: #fff;
	}

	::v-deep(th:last-child) {
		position: sticky;
		right: 0;
		z-index: 1;
	}

	::v-deep(td:last-child) {
		position: sticky;
		right: 0;
		z-index: 1;
	}
}
</style>
