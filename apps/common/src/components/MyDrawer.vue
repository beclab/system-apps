<template>
	<q-btn
		padding="4px"
		color="primary"
		dense
		flat
		no-caps
		@click="drawerRight = !drawerRight"
	>
		<slot name="trigger"></slot>
	</q-btn>
	<el-drawer
		v-model="drawerRight"
		:show-close="false"
		:modal="false"
		:close-on-press-escape="false"
		size="calc(100vw - 230px)"
		class="my-custom-drawer-wrapper"
		destroy-on-close
	>
		<template #header="{ close }">
			<div class="row items-center" tyle="color: #1f1814">
				<div @click="close">
					<q-icon name="arrow_back_ios_new" size="20px" />
					<span class="my-drawer-title">
						<slot name="header"></slot>
					</span>
				</div>
			</div>
			<div class="row">
				<slot name="extra"></slot>
			</div>
		</template>
		<bt-scroll-area
			style="
				height: calc(100vh - 56px);
				margin: -20px;
				padding: 0 32px 20px 32px;
			"
		>
			<slot></slot>
		</bt-scroll-area>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawerRight = ref(false);
</script>

<style lang="scss">
.my-custom-drawer-wrapper {
	&.el-drawer {
		box-shadow: none;
	}
	.my-drawer-title {
		color: #1f1814;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		margin-left: 18px;
	}
	.el-drawer__header {
		margin-bottom: 0;
		padding: 0 18px;
		height: 56px;
	}
}
</style>
