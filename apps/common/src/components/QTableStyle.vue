<template>
	<div class="q-px-lg q-py-sm bg-white around-borders-lg">
		<div class="my-table-container">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.my-table-container {
	& > ::v-deep(.q-table__container .q-table__card) {
		color: $grey-10;
	}

	& > ::v-deep(.q-table__container .q-table thead tr) {
		height: 40px;
	}

	& > ::v-deep(.q-table__container .q-table tbody td) {
		height: 56px;
		color: $grey-8;
	}

	& > ::v-deep(.q-table__container .q-table__control .q-table__bottom-item) {
		color: $grey-5;
	}

	& > ::v-deep(.q-table__container .q-table__bottom) {
		border-top: none;
	}
}
</style>
