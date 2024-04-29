<template>
	<MyPage>
		<MyCard square flat :title="t('ENVIRONMENT_VARIABLE_PL')">
			<q-list bordered class="rounded-borders">
				<template v-for="(item, index) in envlist" :key="item.name">
					<q-separator v-if="index != 0" />
					<MyExpansion
						:label="labelFormat(item)"
						:default-opened="!loading && !item.variables.length"
					>
						<MyChipList v-if="item.variables.length" :data="item.variables">
						</MyChipList>
						<div v-else>
							<Empty></Empty>
						</div>
					</MyExpansion>
				</template>
			</q-list>
			<q-inner-loading :showing="loading"></q-inner-loading>
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
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import MyExpansion from '@packages/ui/src/components/MyExpansion.vue';

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

	if (!isEmpty(containers)) return containers;
	if (!isEmpty(spec)) return get(spec, 'template.spec.containers', []);

	return [];
});

const initContainers = computed(() => {
	const data = envDetail.value || {};
	const { spec, initContainers: initContainersData = [] } = data;

	if (!isEmpty(initContainersData)) return initContainersData;
	if (!isEmpty(spec)) return get(spec, 'template.spec.initContainers', []);

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
			envDetail.value = ObjectMapper.pods(res.data);

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
