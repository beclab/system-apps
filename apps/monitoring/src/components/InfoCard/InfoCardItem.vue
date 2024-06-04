<template>
	<div class="info-card-container">
		<div
			class="info-card-wrapper q-pa-xl"
			:class="[props.active ? 'info-card-wrapper-active' : '']"
			:style="{ background: props.active ? backgroundMode : undefined }"
		>
			<q-img :src="props.img" width="48px" ratio="1" no-spinner />
			<div class="row no-wrap items-center justify-between q-mt-lg">
				<div class="q-mr-lg">
					<div
						class="row items-center info-ratio text-h5 text-ink-1 value-wrapper"
					>
						<q-skeleton v-if="loading" type="text" width="88px" />
						<template v-else>
							<span>{{ _used }}</span>
							<span>/</span>
							<span class="ratio-foolter">{{ _total || '-' }}</span>
						</template>
					</div>
					<div class="text-subtitle1 text-ink-3">
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
						:track-color="props.active ? 'background-1' : 'background-3'"
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
import { computed, ref, StyleValue, toRefs } from 'vue';
import { _capitalize } from 'src/utils/index';
import { isNaN, round } from 'lodash';
import { useQuasar } from 'quasar';
import { useColor } from '@bytetrade/ui';
const $q = useQuasar();
const { color: bgColor }: any = useColor('background-1');
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

const backgroundMode = computed(() =>
	$q.dark.isActive
		? 'linear-gradient(125deg, #1f1f1f 4.57%, #262e37 87.85%)'
		: 'linear-gradient(125deg, #FFF 4.57%, #EBF5FF 87.85%)'
);
</script>

<style lang="scss" scoped>
.info-card-container {
	min-width: 240px;
	cursor: default;
	.info-card-wrapper {
		position: relative;
		border-radius: 20px;
		border: 1px solid $separator;
		background: $background-1;
		&.info-card-wrapper-active {
			border: 1px solid $light-blue-6;
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
