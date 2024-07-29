<template>
	<ReplicaStatus
		:status="replicaStatus"
		:onScale="module !== 'daemonsets'"
		@change="change"
	/>
</template>

<script setup lang="ts">
import { get } from 'lodash-es';
import { computed, toRefs } from 'vue';
import ReplicaStatus from './ReplicaStatus.vue';

interface Props {
	module: any;
	detail: any;
	enableScale: boolean;
}

const emits = defineEmits(['change']);

const props = withDefaults(defineProps<Props>(), {});
const { module, detail, enableScale } = toRefs(props);

const replicaStatus: any = computed(() => {
	let status = {};
	if (!detail.value) {
		return status;
	}
	switch (module.value) {
		default:
		case 'deployments': {
			status = {
				current: detail.value.availablePodNums || 0,
				desire: detail.value.podNums || 0
			};
			break;
		}
		case 'statefulsets': {
			status = {
				current: get(
					detail,
					'status.currentReplicas',
					detail.value.readyPodNums
				),
				desire: detail.value.podNums || 0
			};
			break;
		}
		case 'daemonsets': {
			status = {
				current: get(detail.value, 'status.numberReady', 0),
				desire: get(detail.value, 'status.desiredNumberScheduled', 0)
			};
			break;
		}
		case 'gateways': {
			status = {
				current: Array.isArray(detail.value.pods)
					? detail.value.pods.length
					: 1,
				desire: get(detail, 'replicas', 0)
			};
		}
	}

	// status.onScale = enableScale.value ? this.handleReplicaChange : null;

	return status;
});

function change(value: number) {
	emits('change', value);
}
</script>

<style></style>
