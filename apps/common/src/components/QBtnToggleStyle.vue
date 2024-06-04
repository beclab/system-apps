<template>
	<div class="my-btn-toggle-wrapper">
		<slot></slot>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.my-btn-toggle-wrapper {
	border: 1px solid $btn-stroke;
	border-radius: 8px;
	overflow: hidden;
	::v-deep(> .q-btn-group > .q-btn-item) {
		border-radius: 8px;
	}
}
</style>
