<template>
	<div class="info-card-container">
		<div
			class="row items-center no-wrap info-card-wrapper q-pa-lg"
			:class="[props.active ? 'info-card-wrapper-active' : '']"
		>
			<div
				class="img-wrapper row items-center justify-center"
				:class="[props.active ? 'img-active' : '']"
			>
				<q-img
					:src="props.active && img_active ? img_active : img"
					width="24px"
					ratio="1"
					no-spinner
				/>
			</div>
			<div class="row no-wrap items-center justify-between q-ml-lg">
				<div>
					<div
						class="row items-center info-ratio no-wrap text-h5 text-grey-10 value-wrapper"
					>
						<q-skeleton v-if="loading" type="text" width="88px" />
						<template v-else>
							<span>{{ _used }}</span>
							<span>/</span>
							<span class="ratio-foolter">{{ _total || '-' }}</span>
						</template>
					</div>
					<div class="text-subtitle1 text-grey-6 q-mt-xs">
						<q-skeleton v-if="loading" type="text" width="64px" />
						<template v-else>
							<span>{{ _capitalize(name) }}&nbsp;</span>
							<span>{{ _unit }}</span>
						</template>
					</div>
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
	cursor: default;
	.img-wrapper {
		width: 48px;
		height: 48px;
		background: $grey-1;
		border-radius: 50%;
	}
	.info-card-wrapper {
		position: relative;
		border-radius: 12px;
		border: 1px solid $grey-2;
		&.info-card-wrapper-active {
			border: 1px solid $blue-6;
			background: linear-gradient(
				125deg,
				#f9fdff 4.57%,
				rgba(214, 233, 255, 0.6) 51.18%,
				rgba(204, 227, 255, 0.6) 87.85%
			);
			.img-active {
				background: $blue-2;
			}
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
