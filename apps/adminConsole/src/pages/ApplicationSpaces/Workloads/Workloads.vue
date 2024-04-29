<template>
	<MyTree
		:data="listComputed"
		active-text-color="#1976D2"
		:default-active="defaultActive"
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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

const PodListData = usePodList();

const router = useRouter();
const data = [
	{
		label: 'Deployments',
		kind: 'Deployment',
		value: 'deployments',
		icon: hddRack,
		activeIcon: hddRackLight
	},
	{
		label: 'Statefulsets',
		kind: 'StatefulSet',
		value: 'statefulsets',
		icon: collectionPlay,
		activeIcon: collectionPlayLight
	},
	{
		label: 'Daemonsets',
		kind: 'Daemonset',
		value: 'daemonsets',
		icon: menuButtonWide,
		activeIcon: menuButtonWideLight
	}
];
const workloadsOpeneds = data.map((item) => item.value);
const defaultOpeneds = ref();

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
const defaultActive = ref();
const workloadChildren = ref([]);
const shouldExecuteResponseHandler = ref(true);
let firstListIndexs: [number, number] | undefined = undefined;
const myTreeRef = ref();

const searchText = ref('');
const listComputed = computed(() => {
	if (!searchText.value) return list.value;
	const newList = list.value.map((item) => ({
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
	defaultActive.value = undefined;
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
	defaultOpeneds.value = [list.value[0].id];
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
				path = `/application-spaces/workloads/${child.value}/${namespace}/detail/${item.metadata.name}`;
				id = item.metadata.name;
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
						key: item.metadata.name,
						id: item.metadata.name
					}
				};
				return data;
			})
		};
	});
	const newData = dataTemp.filter(
		(item) => item.children && item.children.length > 0
	);
	// if (!defaultActive.value) {
	//   toDefaultRoute(firstPath, firstActive);
	// }
	return newData;
};

const toDefaultRoute = (firstPath: string, firstActive: string) => {
	if (shouldExecuteResponseHandler.value) {
		firstPath && router.push(firstPath);
		updateSelectedAndExpanded(firstActive);
	}
};

const updateSelectedAndExpanded = (id: string) => {
	defaultActive.value = id;
	defaultOpeneds.value.push(id);
};

let doneFnList: any = {};
let doneFn = (key: string) => doneFnList[key] ?? (() => undefined);

const onLazyLoad = async ({ node, key, done, fail }: any) => {
	doneFnList[key] = done;
	const detail = ObjectMapper.workLoadMapper(node._originData);
	const result = await getPosdList({ ...detail, kind: node.kind });
	const newData = getPosdListFormatter(result);
	done(podDataformate(newData));
};

const containerId = (namespace: any, container: any, uid: string) =>
	container ? `${namespace}-${container}-${uid}` : undefined;

const tabList = (item: any, node: string) => {
	let status = 'running';
	return item.containers.map((container: any) => {
		status = container.ready ? 'running' : 'warning';
		return {
			title: container.name,
			status,
			id: containerId(item.namespace, item.name, container.name),
			route: {
				path: `/application-spaces/pods/containers/overview/${node}/${item.namespace}/${item.name}/${container.name}`
			}
		};
	});
};

watch(
	() => route.query.type,
	(type) => {
		const { namespace, name }: { [key: string]: any } = route.params;
		console.log('type', type);
		if (type === 'pod') {
			myTreeRef.value.setExpanded(`${route.query.podName}`, true);
			layzLoadData(route.query.podName as string, PodListData.data);
			myTreeRef.value.setExpanded(`${namespace}-${name}`, true);
			defaultActive.value = `${namespace}-${name}`;
			setTimeout(() => {
				route.query.scroll === 'true' && scrollToView(`${route.query.podName}`);
			});
		} else if (type === 'workload') {
			myTreeRef.value.setExpanded(name, true);
			defaultActive.value = name;
			setTimeout(() => {
				scrollToView(name);
			});
		}
	}
);

watch(
	() => PodListData.data,
	(newData) => {
		if (route.query.type) return;
		if (firstListIndexs) {
			list.value[firstListIndexs[0]].children[firstListIndexs[1]].children =
				podDataformate(newData);
			firstListIndexs = undefined;
		}
		if (newData.length > 0) {
			const expandedNodes = myTreeRef.value.getExpandedNodes();
			const expandedIds = expandedNodes.map((item: any) => item?.id);
			const { name }: any = route.params;
			expandedIds.includes(name) && layzLoadData(name, newData);
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
		id: `${item.namespace}-${item.name}`,
		_originData: item,
		type: 'pod',
		img: podIcon,
		status: item.podStatus.type,
		selectToExpend: true,
		route: {
			path: `/application-spaces/pods/overview/${item.spec.nodeName}/${item.namespace}/${item.name}/${item.createTime}`
		}
		// children: tabList(item, item.spec.nodeName),
	}));
};

const scrollToView = (id: string) => {
	const target = document.querySelector(`#${id}`);
	if (target) {
		target.scrollIntoView({ behavior: 'smooth' });
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
	defaultActive.value = undefined;
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
