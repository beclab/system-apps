<template>
	<MyRouterLinkList
		:defaultActive="defaultActive"
		:data="list"
		:loading="loading"
		:defaultOpened="defaultOpened"
		:clickable="false"
	>
		<MenuHeader></MenuHeader>
	</MyRouterLinkList>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getNetworkpolicies } from 'src/network';
import MyRouterLinkList from '@packages/ui/src/components/MyRouterLinkList.vue';
import MenuHeader from 'src/layouts/MenuHeader.vue';
import userSpaceIcon from 'src/assets/user-space.svg';

const menuOptions = {
	title: 'title',
	code: 'id',
	icon: 'logo',
	subTitle: 'subTitle',
	router: true
};
const NetworkPolicies = 'NetworkPolicies';
const router = useRouter();
let list = ref<any[]>([]);
const defaultActive = ref();
const loading = ref(false);
const defaultOpened = ref([NetworkPolicies]);
const shouldExecuteResponseHandler = ref(true);

const fetchData = () => {
	const params = {
		sortBy: 'createTime'
	};
	loading.value = true;

	getNetworkpolicies(params)
		.then((res) => {
			let firstPath = '';
			let firstActive = '';
			let path = '';
			let id = '';

			const data = res.data.items.map((item: any) => {
				path = `/network-policies/detail/${item.metadata.namespace}/${item.metadata.name}`;
				id = `${item.metadata.name}-${item.metadata.namespace}`;

				if (!firstPath) {
					firstPath = path;
				}
				if (!firstActive) {
					firstActive = id;
				}

				return {
					id,
					title: item.metadata.namespace,
					subTitle: item.metadata.name,
					img: userSpaceIcon,
					route: {
						path
					}
				};
			});
			list.value = [
				{
					id: NetworkPolicies,
					title: 'Network Policies',
					children: data
				}
			];
			toDefaultRoute(firstPath, firstActive);
		})
		.finally(() => {
			loading.value = false;
		});
};

const toDefaultRoute = (firstPath: string, firstActive: string) => {
	if (shouldExecuteResponseHandler.value) {
		firstPath && router.push(firstPath);
		defaultActive.value = firstActive;
	}
};

onBeforeUnmount(() => {
	shouldExecuteResponseHandler.value = false;
});

fetchData();
</script>

<style lang="scss" scoped>
.my-nodes-container {
	padding: 0 16px;
	line-height: 44px;
	.my-tab-wrapper {
		font-family: 'Roboto';
		font-style: normal;
		font-weight: 500;
		font-size: 12px;
		line-height: 16px;
	}
}
</style>
