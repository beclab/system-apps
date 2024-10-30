<template>
	<QSectionStyle class="q-ml-sm">
		<div class="action-container row q-gutter-x-md q-mr-xxl">
			<QInputStyle>
				<q-input
					v-model="name"
					type="search"
					outlined
					debounce="500"
					:placeholder="t('SEARCH')"
					clearable
					style="width: 240px"
				>
					<template v-slot:prepend>
						<q-icon name="search" color="ink-2" size="xs" />
					</template>
				</q-input>
			</QInputStyle>
			<QSectionStyle>
				<q-select
					v-model="selected"
					:options="options"
					dense
					outlined
					@update:model-value="fetchData"
				/>
			</QSectionStyle>

			<SortButtom @change="sortHandler" :default-value="sort"></SortButtom>
		</div>
	</QSectionStyle>
	<MyGridLayout col-width="510px" gap="xl" :contentLength="sortApps.length">
		<MyCard v-for="(item, itemIndex) in sortApps" :key="item.id">
			<div class="row items-center q-pb-xl">
				<q-skeleton v-if="loading" type="rect" width="32px" height="32px" />
				<div v-else class="row relative-position">
					<template v-for="(child, index) in item.entrances" :key="child.id">
						<MyAvatarImgVue
							:src="child.icon"
							:class="[index !== 0 ? 'avatar-image' : '']"
							:style="{ zIndex: 1 / (index + 1) }"
							:loading="loading"
							:outlined="item.entrances.length > 1"
							@click="EntranceClickHandler(child, itemIndex)"
						></MyAvatarImgVue>
					</template>
				</div>
				<div
					class="row items-center justify-between text-h4 text-ink-1 q-ml-md"
					style="flex: 1"
				>
					<div class="row items-center">
						<q-skeleton v-if="loading" type="text" width="80px" />
						<span v-else> {{ item.currentEntrance.title }}</span>
						<div
							v-if="authLevelFilter(item.currentEntrance.authLevel)"
							class="q-px-md q-py-xs bg-background-3 rounded-borders-lg q-ml-lg"
						>
							<div class="text-subtitle3 text-positive">
								{{ authLevelFilter(item.currentEntrance.authLevel) }}
							</div>
						</div>
					</div>
					<div class="row items-center" v-if="item.state">
						<MyBadge :type="item.state"></MyBadge>
						<span class="text-subtitle3 text-ink-2 q-ml-sm">{{
							$t(item.state.toUpperCase())
						}}</span>
					</div>
				</div>
			</div>
			<div>
				<Metrics
					:namespace="item.namespace"
					:name="item.deployment"
					:cpu_usage="dataFilter('cpu_usage', item.name)"
					:memory_usage="dataFilter('memory_usage', item.name)"
					:net_transmitted="dataFilter('net_transmitted', item.name)"
					:net_received="dataFilter('net_received', item.name)"
					:ownerKind="item.ownerKind"
					:loading="loading"
				></Metrics>
			</div>
		</MyCard>
	</MyGridLayout>
	<Empty
		v-if="sortApps.length === 0"
		size="large"
		style="margin-top: 240px"
	></Empty>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { getAppsList } from 'src/network/index';
import MyAvatarImgVue from '@packages/ui/src/components/MyAvatarImg.vue';
import MyCard from 'src/components/MyCard.vue';
import MyGridLayout from '@packages/ui/src/components/MyGridLayout.vue';
import Metrics from './Metrics.vue';
import MyBadge from '@packages/ui/src/components/MyBadge.vue';
import { useRouter } from 'vue-router';
import { useAppDetailStore } from 'src/stores/AppDetail';
import { get, toLower, capitalize, isEmpty } from 'lodash';
import SortButtom from '@packages/ui/src/components/SortButton.vue';
import QSectionStyle from '@packages/ui/src/components/QSectionStyle.vue';
import QInputStyle from '@packages/ui/src/components/QInputStyle.vue';
import { t } from 'src/boot/i18n';
import Empty from '@packages/ui/src/components/Empty.vue';
import { fetchWorkloadsMetrics, loadingApps, loadingData } from './config';
import { useAppList } from 'src/stores/AppList';

const appList = useAppList();
enum EntranceState {
	Public = 'public',
	Private = 'private'
}

const options = [
	{
		label: t('SORT_BY_NODE_CPU_UTILISATION'),
		value: 'namespace_cpu_usage',
		sortBy: 'cpu_usage'
	},
	{
		label: t('SORT_BY_NODE_MEMORY_UTILISATION'),
		value: t('SORT_BY_NODE_MEMORY_UTILISATION'),
		sortBy: 'memory_usage'
	},
	{
		label: t('SORT_BY_INBOUND_TRAFFIC'),
		value: 'namespace_net_bytes_received',
		sortBy: 'net_received'
	},
	{
		label: t('SORT_BY_OUTBOUND_TRAFFIC'),
		value: 'namespace_net_bytes_transmitted',
		sortBy: 'net_transmitted'
	}
];

const selected = ref(options[0]);
const router = useRouter();
const sort = ref<any>('desc');
const name = ref();

const appDetail = useAppDetailStore();
const userNamespace = `user-space-${appDetail.user.username}`;

const apps = ref(loadingApps);
const loading = ref(true);
const monitoringData = ref(loadingData);

const fetchData = (showLoading = true) => {
	const data = appList.apps;
	if (showLoading) {
		loading.value = true;
	}
	apps.value = data.map((item) => ({
		...item,
		isSystem: item.namespace === userNamespace
	}));
	fetchWorkloadsMetrics(apps.value, userNamespace, sort.value)
		.then((data) => {
			monitoringData.value = data;
		})
		.finally(() => {
			loading.value = false;
		});
};
const sortApps = computed(() => {
	const target = get(monitoringData.value, `${selected.value.sortBy}`, []);
	const data = target.map((item) => ({
		...item,
		currentEntrance: item.currentEntrance
			? item.currentEntrance
			: get(item, 'entrances[0]', {})
	}));
	if (!name.value) {
		return data;
	} else {
		return data.filter((item: any) =>
			toLower(item.title).includes(toLower(name.value))
		);
	}
});

const dataFilter = (type: any, name: string) => {
	return monitoringData.value[type].find((item: any) => item.name === name);
};

const sortHandler = (value: string) => {
	sort.value = value;
	monitoringData.value = { ...loadingData };
	fetchData();
};

const EntranceClickHandler = (data: any, itemIndex: number) => {
	monitoringData.value[selected.value.sortBy][itemIndex].currentEntrance = data;
};

const authLevelFilter = (state: EntranceState) => {
	return state === EntranceState.Public ? capitalize(state) : '';
};

watch(
	() => appList.apps,
	(newData) => {
		if (isEmpty(newData)) {
			loading.value = true;
		} else {
			fetchData();
		}
	},
	{
		immediate: true,
		deep: true
	}
);
</script>
<style lang="scss" scoped>
.action-container {
	position: absolute;
	right: 0;
	top: 60px;
}
.avatar-image {
	margin-left: -20px;
}
</style>
