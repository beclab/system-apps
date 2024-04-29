<template>
	<q-card flat class="row items-center">
		<div class="q-mr-lg">
			<q-circular-progress
				show-value
				:value="status.current / status.desire"
				:min="0"
				:max="1"
				:thickness="0.32"
				size="100px"
				track-color="grey-3"
				color="primary"
			>
				<div class="replication-status-value">
					{{ status.current }}/{{ status.desire }}
				</div>
			</q-circular-progress>
		</div>
		<div class="column justify-center">
			<QButtonStyle>
				<q-btn dense unelevated color="primary" @click="add">
					<q-icon name="add" color="white" />
				</q-btn>
			</QButtonStyle>

			<QButtonStyle class="q-mt-lg">
				<q-btn dense unelevated color="primary" @click="remove">
					<q-icon name="remove" color="white" />
				</q-btn>
			</QButtonStyle>
		</div>
		<CountdownDialog
			:count="5"
			:title="t('ADJUST_REPLICAS')"
			:content="
				t('REPLICAS_SCALE_NOTIFY_CONTENT', {
					num: count
				})
			"
			v-if="visible"
			@close="close"
			@confirm="change"
		/>
	</q-card>
</template>

<script setup lang="ts">
import { t } from 'src/boot/i18n';
import { computed, ref, watch } from 'vue';
import CountdownDialog from './CountdownDialog.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';

interface Props {
	status: {
		current: number;
		desire: number;
	};
}
const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits(['change']);

const visible = ref(false);
const count = ref(props.status.current);
const currentText = t('REPLICAS_CURRENT');
const desireText = t('REPLICAS_DESIRED');

watch(
	() => props.status,
	() => {
		count.value = props.status.current;
	}
);

function change() {
	emits('change', count.value);
}

function add() {
	visible.value = true;
	count.value = props.status.desire + 1;
}

function remove() {
	visible.value = true;
	count.value = props.status.desire - 1;
}

function close() {
	visible.value = false;
	count.value = props.status.current;
}
</script>

<style lang="scss" scoped>
.replication-status-value {
	color: #000;
	font-size: 20px;
	font-weight: 600;
	line-height: 28px;
}
</style>
