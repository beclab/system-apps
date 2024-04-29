<template>
	<div class="info-card-container">
		<div
			class="info-card-wrapper q-pa-xl"
			:class="[props.active ? 'info-card-wrapper-active' : '']"
		>
			<q-img
				:src="props.active && img_active ? img_active : img"
				width="48px"
				ratio="1"
				no-spinner
			/>
			<div class="row no-wrap items-center justify-between q-mt-lg">
				<div class="q-mr-lg">
					<div
						class="row items-center info-ratio text-h5 text-grey-10 value-wrapper"
					>
						<q-skeleton v-if="loading" type="text" width="88px" />
						<template v-else>
							<span>{{ _used }}</span>
							<span>/</span>
							<span class="ratio-foolter">{{ _total || '-' }}</span>
						</template>
					</div>
					<div class="text-subtitle1 text-grey-6">
						<q-skeleton v-if="loading" type="text" width="64px" />
						<template v-else>
							<span>{{ _capitalize(name) }}&nbsp;</span>
							<span>{{ _unit }}</span>
						</template>
					</div>
				</div>
				<div style="flex: 0 0 48px">
					<q-knob
						show-value
						:min="0"
						:max="_total"
						:title="name"
						v-model="_used"
						size="56px"
						:thickness="0.428"
						:color="activeColor"
						:track-color="props.active ? 'white' : 'grey-1'"
						readonly
					>
						<div class="text-subtitle3" :class="[`text-${activeColor}`]">
							<span>{{ percent }}%</span>
						</div>
					</q-knob>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getSuitableUnit, getValueByUnit } from 'src/utils/monitoring';
import { computed, ref, toRefs } from 'vue';
import { _capitalize } from 'src/utils/index';
import { isNaN, round } from 'lodash';

export interface InfoCardItemProps {
	used: string;
	total: string;
	name?: string;
	active?: boolean;
	unitType?: any;
	unit?: string;
	img?: string;
	img_active?: string;
	loading?: boolean;
}

const props = withDefaults(defineProps<InfoCardItemProps>(), {
	active: false,
	title: ''
});

const { total, used, unitType, unit } = toRefs(props);
const _unit = computed(
	() =>
		getSuitableUnit(total.value || used.value, unitType.value as any) ||
		unit?.value
);
const _used = computed(() => getValueByUnit(used.value, _unit.value));
const _total = computed(() => getValueByUnit(total.value, _unit.value));

const percent = computed(() => {
	return round((_used.value / _total.value) * 100, 0) || '-';
});
const activeColor = computed(() =>
	isNaN(percent.value)
		? 'white'
		: percent.value > 80
		? 'negative'
		: percent.value > 50
		? 'warning'
		: 'positive'
);
</script>

<style lang="scss" scoped>
.info-card-container {
	min-width: 240px;
	cursor: default;
	.info-card-wrapper {
		position: relative;
		border-radius: 20px;
		border: 1px solid $grey-2;
		&.info-card-wrapper-active {
			border: 1px solid $light-blue-6;
			background: linear-gradient(
				125deg,
				#f9feff 4.57%,
				rgba(214, 240, 255, 0.6) 51.18%,
				rgba(204, 230, 255, 0.6) 87.85%
			);
		}
		.info-item {
			font-size: 12px;
			line-height: 12px;
			color: #5c5551;
			line-height: 16px;
			&.info-item-active {
				color: #ffffff;
			}
		}
		.value-wrapper {
			white-space: nowrap;
		}
	}
}
</style>
