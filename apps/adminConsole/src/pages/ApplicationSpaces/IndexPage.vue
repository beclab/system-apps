<template>
	<MyTree
		:data="list"
		active-text-color="#1976D2"
		:menu-options="menuOptions"
		:default-openeds="defaultOpeneds"
		:default-active="defaultActive"
		:loading="loading"
		:accordion="false"
	>
		<MenuHeader></MenuHeader>
	</MyTree>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNamespacesGroup } from 'src/network';
import MyTree from '@packages/ui/src/components/Menu/MyTree.vue';
import { get } from 'lodash-es';
import { getNamespaceIcon, customNamesapceIcon } from './config';
import MenuHeader from 'src/layouts/MenuHeader.vue';

const menuOptions = {
	title: 'title',
	code: 'id',
	icon: 'logo',
	router: true
};

const list = ref([]);
const loading = ref(false);
const route = useRoute();
let owner = '';

const defaultActive = computed(() => {
	return route.params.namespace;
});

const userType = 'User Projects';
const systmeType = 'System Projects';
const defaultOpeneds = ref([userType, systmeType, route.params.namespace]);

const fetchData = () => {
	const params = {
		sortBy: 'createTime',
		labelSelector: 'kubesphere.io/workspace!=kubesphere.io/devopsproject'
	};
	loading.value = true;

	getNamespacesGroup(params)
		.then((res) => {
			const result = res.data;
			const data: any = result;
			const newData = data.map((workspace: any) => ({
				title: workspace.title,
				id: workspace.title,
				selectable: false,
				icon: getNamespaceIcon('default'),
				children: workspace.data.map((item: any) => {
					return {
						title: item.metadata.name,
						id: item.metadata.name,
						img: getNamespaceIcon(item.metadata.name),
						route: {
							path: `/application-spaces/workloads/${item.metadata.name}`
						}
					};
				})
			}));

			list.value = newData.filter(
				(item: any) => item.children && item.children.length > 0
			);

			defaultOpeneds.value = [data[0].title];
		})
		.finally(() => {
			loading.value = false;
		});
};

fetchData();
</script>

<style lang="scss" scoped></style>
