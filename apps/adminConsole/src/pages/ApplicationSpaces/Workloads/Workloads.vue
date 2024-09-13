<template>
	<MyTree
		:data="listComputed"
		active-text-color="#1976D2"
		:default-active="active"
		:menu-options="menuOptions"
		:default-openeds="defaultOpeneds"
		:loading="loading"
		:accordion="true"
		ref="myTreeRef"
		@lazy-load="onLazyLoad"
		:z-index="2"
		:index="1"
		:key="$route.params.namespace"
	/>
</template>

<script setup lang="ts">
import {
	getNamespaceDaemonsets,
	getNamespaceStatefulsets,
	getNamespaceDeployments
} from 'src/network';
import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
	watch,
	nextTick
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MyTree from '@packages/ui/src/components/Menu/MyTree.vue';
import collectionPlay from 'src/assets/Statefulsets.svg';
import collectionPlayLight from 'src/assets/collection-play_light.svg';
import hddRack from 'src/assets/Deployments.svg';
import hddRackLight from 'src/assets/hdd-rack_light.svg';
import menuButtonWide from 'src/assets/Daemonsets.svg';
import menuButtonWideLight from 'src/assets/menu-button_light.svg';
import { get } from 'lodash-es';
import { usePodList } from '@packages/ui/src/stores/podList';
import {
	configurationsDataFormatter,
	configurationsOpeneds,
	getConfigurationsData
} from '../Configurations/config';
import {
	getServicesData,
	servicesDataFormatter,
	ServiceOpeneds
} from '../Services/config';
import { Pagination } from '@packages/ui/src/network/network';
import { ObjectMapper } from '@packages/ui/src/utils/object.mapper';
import {
	getPosdList,
	getPosdListFormatter
} from '@packages/ui/src/containers/PodsList/config';
import podIcon from '@packages/ui/src/assets/pod.svg';
import { useI18n } from 'vue-i18n';
import { componentName } from 'src/router/const';
import { isEmpty } from 'lodash';
const { t } = useI18n();

const PodListData = usePodList();

const router = useRouter();
const data = [
	{
		label: 'DEPLOYMENT_PL',
		kind: 'Deployment',
		value: 'deployments',
		icon: hddRack,
		activeIcon: hddRackLight
	},
	{
		label: 'STATEFULSETS_PL',
		kind: 'StatefulSet',
		value: 'statefulsets',
		icon: collectionPlay,
		activeIcon: collectionPlayLight
	},
	{
		label: 'DAEMONSET_PL',
		kind: 'DaemonSet',
		value: 'daemonsets',
		icon: menuButtonWide,
		activeIcon: menuButtonWideLight
	}
];

const menuOptions = {
	title: 'title',
	code: 'id',
	icon: 'logo',
	router: true,
	collapse: false
};

const route = useRoute();
const list = ref<any[]>([]);
const loading = ref(false);
const workloadChildren = ref([]);
const shouldExecuteResponseHandler = ref(true);
let firstListIndexs: [number, number] | undefined = undefined;
const myTreeRef = ref();

const searchText = ref('');
const defaultOpeneds = ref([route.params.kind]);

const active = computed(() => route.params.uid || route.params.pods_uid);

const listWithLanguages = computed(() =>
	list.value.map((item) => ({ ...item, title: t(item.title) }))
);
const listComputed = computed(() => {
	if (!searchText.value) return listWithLanguages.value;
	const newList = listWithLanguages.value.map((item) => ({
		...item,
		children: item.children.filter((child: any) =>
			child.title.includes(searchText.value)
		)
	}));

	return newList.filter((item) => item.children.length > 0);
});

const fetchData = async () => {
	const { namespace, name }: { [key: string]: any } = route.params;
	const params = {
		sortBy: 'createTime',
		namespace
	};
	searchText.value = '';
	loading.value = true;
	const [workloadData, configurationsData, servicesData] = await Promise.all([
		getWorkloadsData(namespace, { sortBy: 'createTime' }),
		getConfigurationsData(params),
		getServicesData(params)
	]);

	loading.value = false;
	const newWorkloadsData = workloadsDataFormatter(
		workloadData,
		namespace,
		name
	);
	const newConfigurationsData = configurationsDataFormatter(
		configurationsData,
		namespace
	);
	const newServicesData = servicesDataFormatter(servicesData, namespace);

	workloadChildren.value = newWorkloadsData
		.map((item: any) => item.children)
		.flat();
	list.value = [
		...newWorkloadsData,
		...newConfigurationsData,
		...newServicesData
	];

	nextTick(() => {
		if (route.params.pods_uid) {
			myTreeRef.value.setExpanded(route.params.pods_uid, true);
		} else {
			myTreeRef.value.setExpanded(listComputed.value[0].id, true);
		}
	});
};

const getWorkloadsData = (namespace: string, params: Pagination) => {
	return Promise.all([
		getNamespaceDeployments(namespace, params),
		getNamespaceStatefulsets(namespace, params),
		getNamespaceDaemonsets(namespace, params)
	]);
};

const workloadsDataFormatter = (
	res: any,
	namespace: string,
	name: string
): any => {
	let firstPath = '';
	let firstActive = '';
	let path = '';
	let id = '';
	const dataTemp = data.map((child, index) => {
		let childData = res[index].data.items;
		return {
			title: child.label,
			id: child.value,
			selectable: false,
			children: childData.map((item: any, childIndex: number) => {
				path = `/application-spaces/workloads/${child.value}/${namespace}/${item.metadata.name}/${item.metadata.uid}/${item.metadata.creationTimestamp}`;
				id = item.metadata.uid;
				if (!firstPath) {
					firstPath = path;
					firstActive = id;
					firstListIndexs = [index, childIndex];
				}
				if (route.params.name === id) {
					firstPath = path;
					firstActive = id;
					firstListIndexs = [index, childIndex];
				}

				const data = {
					title: item.metadata.name,
					id,
					// expandable: true,
					selectable: true,
					_originData: item,
					kind: child.kind,
					img: get(
						item,
						'metadata.annotations["applications.app.bytetrade.io/icon"]',
						child.icon
					),
					lazy: true,
					selectToExpend: true,
					route: {
						path,
						key: item.metadata.uid,
						id: item.metadata.uid
					}
				};
				return data;
			})
		};
	});
	const newData = dataTemp.filter(
		(item) => item.children && item.children.length > 0
	);

	return newData;
};

let doneFnList: any = {};
let doneFn = (key: string) => doneFnList[key] ?? (() => undefined);

const onLazyLoad = async ({ node, key, done, fail }: any) => {
	doneFnList[key] = done;

	try {
		const detail = ObjectMapper.workLoadMapper(node._originData);
		const result = await getPosdList({ ...detail, kind: node.kind });
		const newData = getPosdListFormatter(result);
		done(podDataformate(newData));
	} catch (error) {
		done(podDataformate([]));
	}
};

watch(
	() => route.query.type,
	(newValue, oldValue) => {
		if (newValue && !oldValue) {
			const { pods_uid }: { [key: string]: any } = route.params;
			myTreeRef.value.setExpanded(route.params.kind, true);
			nextTick(() => {
				setTimeout(() => {
					scrollToView(pods_uid);
				}, 650);
			});
		}
	}
);

watch(
	() => route.params.uid,
	(newValue, oldValue) => {
		if (!isEmpty(newValue) && isEmpty(oldValue)) {
			myTreeRef.value.setExpanded(route.params.pods_uid, true);
		}
	}
);

watch(
	() => PodListData.data,
	(newData) => {
		if (route.query.type) return;
		if (firstListIndexs) {
			listWithLanguages.value[firstListIndexs[0]].children[
				firstListIndexs[1]
			].children = podDataformate(newData);
			firstListIndexs = undefined;
		}
		if (newData.length > 0) {
			layzLoadData(route.params.pods_uid as string, newData);
		}
	},
	{
		deep: true
	}
);

const layzLoadData = (key: string, data: any) => {
	const newData = podDataformate(data);
	doneFn(key)(newData);
};

const podDataformate = (data: any) => {
	const { namespace, kind, name }: { [key: string]: any } = route.params;
	return data.map((item: any) => ({
		title: `${item.name}`,
		id: item.uid,
		_originData: item,
		type: 'pod',
		img: podIcon,
		status: item.podStatus.type,
		selectToExpend: true,
		route: {
			name: componentName.WORKLOAD_PODS,
			params: {
				...route.params,
				name: item.name,
				node: item.spec.nodeName,
				uid: item.uid,
				createTime: item.createTime
			}
		}
	}));
};

const scrollToView = (id: string) => {
	const target = document.querySelector(`#${id}`);
	if (target) {
		target.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
};

watch(
	() => route.params.namespace,
	async (newId) => {
		fetchData();
	}
);

onMounted(() => {
	fetchData();
});

onBeforeUnmount(() => {
	shouldExecuteResponseHandler.value = false;
});
</script>

<style lang="scss" scoped>
.workload-search {
	position: absolute;
	z-index: 2;
	top: -2px;
	right: -2px;
	cursor: pointer;
	&::after {
		content: '';
		position: absolute;
		left: 1px;
		z-index: 1;
		top: -18px;
		border-top: 26px solid rgba(0, 0, 0, 0);
		border-right: 0 solid green;
		border-bottom: 26px solid rgba(0, 0, 0, 0);
		border-left: 26px solid rgba(0, 0, 0, 0.08);
		transform: rotateZ(-45deg);
	}
	.workload-search-btn {
		cursor: pointer;
	}
}
</style>
