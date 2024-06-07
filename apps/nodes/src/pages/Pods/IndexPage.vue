<template>
	<MySplitter>
		<template v-slot:before>
			<MyScrollArea style="height: 100%">
				<MyRouterLinkList
					:data="list.items"
					:defaultActive="defaultActive"
					@selected="itemClick"
					:loading="loading"
				></MyRouterLinkList>
			</MyScrollArea>
		</template>
		<template v-slot:after>
			<div style="flex: 1; height: 100%">
				<router-view></router-view>
			</div>
		</template>
	</MySplitter>
</template>

<script setup lang="ts">
import {
	computed,
	nextTick,
	onBeforeUnmount,
	reactive,
	ref,
	watch,
	watchEffect
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPodsList } from 'src/network';
import MyLoading from '@packages/ui/src/components/MyLoading.vue';
import { get, isEmpty, isEqual, isNil, omitBy } from 'lodash';
import { t } from 'src/boot/i18n';
import { getLocalTime } from 'src/utils/index.js';
import { PodsMapper } from 'src/utils/object.mapper';
import MySplitter from '@packages/ui/src/components/MySplitter.vue';
import MyScrollArea from '@packages/ui/src/containers/MyScrollArea.vue';
import { UsePod } from '@packages/ui/src/stores/PodData';
import Empty from '@packages/ui/src/components/Empty.vue';
import { menuIdFormat } from '@packages/ui/src/utils/menu-config';
import { useSplitMenu } from '@packages/ui/src/stores/menu';
import podIcon from '@packages/ui/src/assets/pod.svg';
import MyRouterLinkList from '@packages/ui/src/components/MyRouterLinkList.vue';

interface Props {
	filter: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
	filter: {} as any
});

const filterQuery = computed(() => props.filter);

const idFormat = (namespace: any, name: any) =>
	namespace && name ? `${namespace}-${name}` : undefined;

const splitMenu = useSplitMenu();
const usePod = UsePod();
const route = useRoute();
const router = useRouter();
const shouldExecuteResponseHandler = ref(true);
const myTreeRef = ref();

const opened = idFormat(route.params.namespace, route.params.name)
	? [idFormat(route.params.namespace, route.params.name)]
	: [];
const defaultOpeneds = ref([
	idFormat(route.params.namespace, route.params.name)
]);

const type = route.fullPath.split('/')[3];

const containerId = (namespace: any, container: any) =>
	container ? `${namespace}-${container}` : undefined;
const defaultActive = ref(
	containerId(route.params.namespace, route.params.container)
);

const scrollToView = () => {
	const target = document.querySelector(`#${defaultOpeneds.value[0]}`);
	if (target) {
		target.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
};

const menuOptions = {
	title: 'title',
	code: 'id',
	icon: 'logo',
	subTitle: 'subTitle',
	router: true
};

let list = reactive<any>({
	items: [],
	totalItems: 0
});

const statusList = ref();

const tabList = (item: any) => {
	const params = {
		namespace: item.metadata.namespace,
		name: item.metadata.name
	};
	return item.spec.containers.map((container: any) => ({
		title: container.name,
		id: containerId(item.metadata.namespace, container.name),
		route: {
			path: `/${splitMenu.type}/pods/containers/overview/${item.spec.nodeName}/${item.metadata.namespace}/${item.metadata.name}/${container.name}`
		}
	}));
};

const loading = ref(false);

const podData = ref();
function itemClick(id: string, target: any, routerLink = true) {
	const data = target.originData;
	podData.value = data;
	usePod.setDetail(data);
	if (routerLink) {
		router.push({
			path: `/${splitMenu.type}/pods/overview/${data.spec.nodeName}/${data.metadata.namespace}/${data.metadata.name}`
		});
		// nextTick(() => {
		//   myTreeRef.value && myTreeRef.value.setExpanded(id, true);
		// });
	}
}

const clearData = () => {
	list = {
		items: [],
		totalItems: 0
	};
};

const fetchData = () => {
	const { namespace, node: nodeName }: Record<string, any> = route.params;
	const params = {
		nodeName,
		sortBy: 'startTime',
		...omitBy(props.filter, isEmpty)
	};
	clearData();
	loading.value = true;
	getPodsList(params)
		.then((res) => {
			list.items = res.data.items.map((item: any) => ({
				title: item.metadata.name,
				id: idFormat(item.metadata.namespace, item.metadata.name),
				img: podIcon,
				originData: item,
				selectToExpend: true,
				route: {
					path: `/${splitMenu.type}/pods/overview/${item.spec.nodeName}/${item.metadata.namespace}/${item.metadata.name}`
				}
				// children: tabList(item),
			}));
			list.totalItems = res.data.totalItems;

			if (shouldExecuteResponseHandler.value) {
				if (defaultOpeneds.value.length > 0) {
					const target = list.items.find(
						(item: any) =>
							item.id === idFormat(route.params.namespace, route.params.name)
					);
					target && itemClick('', target, false);
				} else {
					list.items[0] && itemClick('', list.items[0]);
					const value = idFormat(
						get(list.items[0], 'originData.metadata.namespace'),
						get(list.items[0], 'originData.metadata.name')
					);
					defaultActive.value = value;
				}

				setTimeout(() => {
					scrollToView();
				}, 300);
			}
		})
		.finally(() => {
			loading.value = false;
		});
};

// watch(filterQuery, (newData, oldData) => {
//   if (!isEqual(newData, oldData)) {
//     defaultOpeneds.value = [];
//     defaultActive.value = undefined;
//     fetchData();
//   }
// });

onBeforeUnmount(() => {
	shouldExecuteResponseHandler.value = false;
});

fetchData();
</script>

<style lang="scss" scoped>
.my-nodes-container {
	padding: 0 16px;
	line-height: 44px;
	font-size: 12px;
	.my-tab-wrapper {
		font-family: 'Roboto';
		font-style: normal;
		font-weight: 500;
		font-size: 12px;
		line-height: 16px;
	}
}
</style>
