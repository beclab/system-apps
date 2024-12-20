<template>
	<QSectionStyle>
		<q-select v-bind="$attrs">
			<template v-slot:option="scope">
				<div
					class="row justify-between items-center cursor-pointer q-pa-sm select-option-item"
					:class="[scope.selected ? 'selected-active' : '']"
					v-bind="scope.itemProps"
				>
					<span class="text-body3">
						{{
							$attrs['option-label']
								? $t(scope.opt[$attrs['option-label']])
								: scope.opt['label']
						}}
					</span>
					<q-icon
						v-if="isEqual(scope.opt, $attrs.modelValue)"
						color="primary"
						size="16px"
						name="sym_r_check_circle"
					/>
				</div>
			</template>
			<template #selected v-if="$slots.selected">
				<slot name="selected"></slot>
			</template>
		</q-select>
	</QSectionStyle>
</template>

<script lang="ts" setup>
import QSectionStyle from '@packages/ui/src/components/QSectionStyle.vue';
import { isEqual } from 'lodash';
</script>

<style lang="scss" scoped>
.select-option-item {
	gap: 4px;
	min-width: 108px;
	&.selected-active {
		background: $background-hover;
		border-radius: 8px;
	}
}
</style>
<!-- <style lang="scss">
.q-menu {
	border-radius: 4px;
	background: $background-2;
	box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
	.q-virtual-scroll__content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
}
</style> -->
