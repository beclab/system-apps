<template>
	<div class="info-card-container">
		<div class="info-card-wrapper q-pa-lg">
			<div class="row justify-between items-center">
				<div class="icon-wrapper row inline items-center justify-center">
					<q-img :src="props.img" width="20px" ratio="1" no-spinner />
				</div>
				<q-btn class="arrow-icon-wrapper" flat padding="0px">
					<q-img :src="arrowRightIcon2" width="20px" ratio="1" no-spinner />
				</q-btn>
			</div>
			<div class="text-subtitle2 text-ink-3 q-mt-lg">
				<q-skeleton v-if="loading" type="text" width="64px" />
				<template v-else>
					<span>{{ name }}&nbsp;</span>
					<span>{{ _unit === 'core' ? $t('core') : _unit }}</span>
				</template>
			</div>
			<div
				class="row items-center info-ratio text-h6 text-ink-1 value-wrapper q-mt-xs"
			>
				<q-skeleton v-if="loading" type="text" width="88px" />
				<template v-else-if="!isNaN(_used) && !isNull(_total)">
					<span>{{ worthValue(_used) }}</span>
					<span>/</span>
					<span class="ratio-foolter">{{ worthValue(_total) || '-' }}</span>
				</template>
			</div>
			<div
				class="row items-center justify-between q-gutter-x-md q-mt-md"
				v-if="!isNaN(_used) && !isNull(_total)"
			>
				<span class="text-subtitle3" :class="textColorClass"
					>{{ percent }}%</span
				>
				<q-linear-progress
					style="flex: 1"
					rounded
					size="4px"
					:value="ratio"
					:color="activeColor"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getSuitableUnit, getValueByUnit } from 'src/utils/monitoring';
import { computed, ref, StyleValue, toRefs } from 'vue';
import { _capitalize } from 'src/utils/index';
import { isNaN, isNull, round } from 'lodash';
import { useQuasar } from 'quasar';
import { worthValue } from 'src/utils/number';
import arrowRightIcon2 from 'assets/arrow-right2.svg';
import { RouteLocationRaw } from 'vue-router';

const $q = useQuasar();
export interface InfoCardItemProps {
	used?: string;
	total?: string;
	name: string;
	active?: boolean;
	unitType?: any;
	unit?: string;
	img?: string;
	img_active?: string;
	loading?: boolean;
	route: RouteLocationRaw;
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
const _used = computed(() => getValueByUnit(used.value, _unit.value, 2));
const _total = computed(() => getValueByUnit(total.value, _unit.value, 2));

const percent = computed(() => {
	return round((_used.value / _total.value) * 100, 0) || '-';
});

const ratio = computed(() => {
	return _used.value / _total.value;
});

const activeColor = computed(() =>
	isNaN(percent.value)
		? 'white'
		: Number(percent.value) > 80
		? 'negative'
		: Number(percent.value) > 50
		? 'warning'
		: 'positive'
);

const textColorClass = computed(() => `text-${activeColor.value}`);
</script>

<style lang="scss" scoped>
.info-card-container {
	cursor: default;
	.info-card-wrapper {
		height: 170px;
		position: relative;
		border-radius: 20px;
		border: 1px solid $separator;
		background: $background-1;
		&:hover {
			border-color: $light-blue-6;
			background: linear-gradient(
				125deg,
				$background-1 4.57%,
				$light-blue-soft 87.85%
			);
		}
		.icon-wrapper {
			width: 32px;
			height: 32px;
			border-radius: 8px;
			border: 1px solid $separator-2;
			background: $background-1;
		}
		.arrow-icon-wrapper {
			margin-right: -4px;
			border-radius: 6px;
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
