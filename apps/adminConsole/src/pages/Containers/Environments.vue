<template>
	<MyPage>
		<MyCard square flat :title="t('ENVIRONMENT_VARIABLE_PL')">
			<div v-for="item in envlist" :key="item.name">
				<q-expansion-item :label="labelFormat(item)">
					<MyChipList v-if="item.variables.length" :data="item.variables">
					</MyChipList>
					<div style="height: 72px" v-else>
						<Empty size="mini"></Empty>
					</div>
				</q-expansion-item>
				<q-separator spaced inset />
			</div>
			<q-inner-loading :showing="loading"> </q-inner-loading>
		</MyCard>
	</MyPage>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch, computed } from 'vue';
import MyLoading from 'src/components/MyLoading.vue';
import { get, isEmpty, isNil } from 'lodash';
import { t } from 'src/boot/i18n';
import Empty from '@packages/ui/src/components/Empty.vue';
import MyChipList from '@packages/ui/src/containers/MyChipList.vue';
import { getDeploymentsDetail, getPodDetail } from '@packages/ui/src/network';
import { ObjectMapper } from 'src/utils/object.mapper';
import { fetcEnvList } from '@packages/ui/src/containers/env';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import MyCard from '@packages/ui/src/components/MyCard2.vue';

interface Props {
	module?: string;
}

let loading = ref(false);
const route = useRoute();
const envDetail = ref();
const envlist = ref();
const variables = ref();

const props = withDefaults(defineProps<Props>(), {});

const labelFormat = (item: any) => {
	let label = '';
	label =
		item.type === 'init'
			? t('INIT_CONTAINER_VALUE', { value: item.name })
			: t('CONTAINER_VALUE', { value: item.name });
	return label;
};

const containers = computed(() => {
	const data = envDetail.value || {};
	const { spec, containers = [] } = data;

	return [data];
});

const initContainers = computed(() => {
	const data = envDetail.value || {};
	const { spec, initContainers: initContainersData = [] } = data;

	return [data];

	return [];
});

const fetchData = async () => {
	const { namespace, cluster }: { [key: string]: any } = route.params;
	envlist.value = await fetcEnvList({
		namespace: namespace,
		cluster: cluster,
		containers: containers.value,
		initContainers: initContainers.value
	});
};

const fetchEnv = () => {
	const { namespace, name, container }: { [key: string]: any } = route.params;
	loading.value = true;
	getPodDetail({ namespace, podName: name })
		.then((res) => {
			// envDetail.value = ObjectMapper.pods(res.data);

			const pod = ObjectMapper.pods(res.data);
			const detail =
				pod.containers.find((item: any) => item.name === container) ||
				pod.initContainers.find((item: any) => item.name === container);
			detail.createTime = get(pod, 'createTime', '');
			detail.app = detail.app || pod.app;

			envDetail.value = detail;

			fetchData();
		})
		.finally(() => {
			loading.value = false;
		});
};

watch(
	() => route.params,
	async (newId) => {
		fetchEnv();
	}
);
onMounted(() => {
	fetchEnv();
});
</script>
