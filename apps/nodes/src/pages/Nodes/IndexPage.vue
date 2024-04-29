<template>
	<MySplitter>
		<template v-slot:before>
			<MyScrollArea>
				<MyTree
					:data="list.items"
					:default-active="defaultActive"
					:menu-options="menuOptions"
					:default-openeds="defaultOpeneds"
					:loading="loading"
					@open="openHandler"
				>
				</MyTree>
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
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNodesList } from 'src/network';
import MyTree from '@packages/ui/src/components/Menu/MyTree.vue';
import MySplitter from '@packages/ui/src/components/MySplitter.vue';
import MyScrollArea from '@packages/ui/src/containers/MyScrollArea.vue';
import indication from '@packages/ui/src/assets/indication.svg';

const router = useRouter();
const route = useRoute();
const shouldExecuteResponseHandler = ref(true);
const menuOptions = {
	title: 'title',
	code: 'id',
	icon: 'logo',
	subTitle: 'subTitle',
	router: true
};

let defaultOpeneds = [route.params.node];
const type = route.fullPath.split('/')[2];
const defaultActive = ref(
	route.params.node ? `${type}-${route.params.node}` : undefined
);

let list = reactive<any>({
	items: [],
	totalItems: 0
});

const openHandler = (id: string, target: any) => {
	const data = target.children[0];
	defaultActive.value = data.id;
	router.push(data.route);
};

const tabList = (item: Record<string, any>) => {
	console.log('tabList: ', item);
	const filter = { nodeName: item.metadata.name };
	return [
		{
			title: 'Detail',
			id: `detail-${item.metadata.name}`,
			route: { path: `/nodes/detail/${item.metadata.name}` }
		},
		{
			title: 'Metadata',
			id: `metadata-${item.metadata.name}`,
			route: { path: `/nodes/metadata/${item.metadata.name}` }
		},
		{
			title: 'Pods',
			id: `pods-${item.metadata.name}`,
			route: {
				path: `/nodes/pods/${item.metadata.name}`,
				query: {
					filter: JSON.stringify(filter)
				}
			}
		},
		{
			title: 'Events',
			id: `events-${item.metadata.name}`,
			route: { path: `/nodes/events/${item.metadata.name}` }
		}
	];
};

let loading = ref(false);

const fetchData = () => {
	const params = {
		sortBy: 'createTime'
		// labelSelector: '!node-role.kubernetes.io/edge',
	};
	loading.value = true;
	getNodesList(params)
		.then((res) => {
			list.items = res.data.items.map((item: any, index: number) => ({
				title: item.metadata.name,
				id: `${item.metadata.name}`,
				selectable: false,
				img: indication,
				imgActiveDisabled: true,
				originData: item,
				children: tabList(item)
			}));
			const originData = list.items[0].originData;

			if (!defaultActive.value && shouldExecuteResponseHandler.value) {
				router.push({
					path: `/nodes/detail/${originData.metadata.name}`
				});
				defaultActive.value = `detail-${originData.metadata.name}`;
				defaultOpeneds = [originData.metadata.name];
			}
		})
		.finally(() => {
			loading.value = false;
		});
};

onMounted(() => {
	fetchData();
});

onBeforeUnmount(() => {
	shouldExecuteResponseHandler.value = false;
	defaultActive.value = undefined;
});
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
