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
import { getNamespacesList } from 'src/network';
import MyTree from '@packages/ui/src/components/Menu/MyTree.vue';
import { get } from 'lodash-es';
import {
	getNamespaceIcon,
	systemNamespaces,
	systemNamespacesOther,
	customNamesapceIcon,
	checkClusterScoped
} from './config';
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

const workspaceSplit = (data: any): any => {
	const systemWorkspace: any = [];
	const UserWorkspace: any = [];
	data.forEach((item: any) => {
		if (!owner) {
			owner = item.metadata.labels['bytetrade.io/ns-owner'];
		}
		/** Manual grouping of namespace */
		if (
			(get(item, 'metadata.labels.["kubesphere.io/workspace"]') ===
				'system-workspace' &&
				systemNamespaces(owner).includes(get(item, 'metadata.name'))) ||
			systemNamespacesOther.includes(get(item, 'metadata.name')) ||
			checkClusterScoped(get(item, 'metadata.name'))
		) {
			systemWorkspace.push(item);
		} else {
			UserWorkspace.push(item);
		}
	});

	return [
		{
			title: defaultOpeneds.value[0],
			data: UserWorkspace
		},
		{
			title: defaultOpeneds.value[1],
			data: systemWorkspace
		}
	];
};

const fetchData = () => {
	const params = {
		sortBy: 'createTime',
		labelSelector: 'kubesphere.io/workspace!=kubesphere.io/devopsproject'
	};
	loading.value = true;

	getNamespacesList(params)
		.then((res) => {
			const result = res.data.items;
			const data = workspaceSplit(result);
			const userReg = new RegExp(`-${owner}$`);
			let title = '';

			const newData = data.map((workspace: any) => ({
				title: workspace.title,
				id: workspace.title,
				selectable: false,
				icon: getNamespaceIcon('default'),
				children: workspace.data.map((item: any) => {
					title = item.metadata.name;
					if (
						workspace.title === userType &&
						!Object.keys(customNamesapceIcon(owner)).includes(title)
					) {
						title = title.replace(userReg, '');
					}

					return {
						title,
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
		})
		.finally(() => {
			loading.value = false;
		});
};

fetchData();
</script>

<style lang="scss" scoped></style>
