<template>
	<MyTree
		:data="list"
		active-text-color="#1976D2"
		:menu-options="menuOptions"
		:default-openeds="defaultOpeneds"
		:default-active="$route.params.jobUid"
		:loading="loading"
		:accordion="false"
		@lazy-load="onLazyLoad"
	>
		<MenuHeader></MenuHeader>
		<template #after-default>
			<div class="position-relative" style="height: 100vh">
				<Empty3 :refresh="false"></Empty3>
			</div>
		</template>
	</MyTree>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { getJobs, getNameSpacePodsList } from 'src/network';
import MyTree from '@packages/ui/src/components/Menu/MyTree.vue';
import { get } from 'lodash-es';
import MenuHeader from 'src/layouts/MenuHeader.vue';
import { jobType } from '@packages/ui/src/network/network';
import { ObjectMapper } from '@packages/ui/src/utils/object.mapper';
import cronjobsIcon from 'src/assets/cronjobs.png';
import jobsIcon from 'src/assets/jobs.png';
import podIcon from '@packages/ui/src/assets/pod.svg';
import { isEmpty, lowerCase } from 'lodash';
import { getWorkloadStatus } from 'src/utils/status';
import Empty3 from '@packages/ui/src/components/Empty3.vue';
import router from 'src/router';

const menuOptions = {
	title: 'title',
	code: 'id',
	icon: 'logo',
	router: true
};

const menuList = [
	{
		title: jobType[0],
		id: jobType[0]
	},
	{
		title: jobType[1],
		id: jobType[1]
	}
];

const list = ref([]);
const loading = ref(false);
const route = useRoute();
let owner = '';

const userType = 'User Projects';
const systmeType = 'System Projects';
const defaultOpeneds = ref([userType, systmeType, route.params.namespace]);
const defaultActive = ref(route.params.jobUid);
const fetchData = async (showLoading = true) => {
	const params = {
		sortBy: 'createTime',
		limit: 1000
	};
	if (showLoading) {
		loading.value = true;
	}
	try {
		const {
			data: { items: jobsItem1 }
		} = await getJobs(jobType[0], params);

		const {
			data: { items: jobsItem2 }
		} = await getJobs(jobType[1], params);

		const data1: any = jobsItem1.map((item) => ObjectMapper[jobType[1]](item));

		const data2: any = jobsItem2.map((item) => ObjectMapper[jobType[1]](item));

		const newData: any = menuList.map((menu: any) => {
			const child1 = data1.map((item: any) => {
				const { status } = getWorkloadStatus(item, jobType[0]);

				return {
					title: item.name,
					id: item.uid,
					img: cronjobsIcon,
					status: lowerCase(status),
					route: {
						path: `/jobs/cronjob/${item.namespace}/${item.name}/${item.uid}`
					}
				};
			});
			const child2 = data2.map((item: any) => {
				const { status } = getWorkloadStatus(item, jobType[1]);
				const type = status === 'Running' ? 'JobRunning' : status;

				return {
					title: item.name,
					id: item.uid,
					img: jobsIcon,
					selectable: true,
					lazy: true,
					selectToExpend: true,
					uid: item.uid,
					namespace: item.namespace,
					detail: item,
					status: lowerCase(type),
					route: {
						path: `/jobs/job/${item.namespace}/${item.name}/${item.uid}`
					}
				};
			});

			return {
				title: menu.title,
				id: menu.id,
				selectable: false,
				children: menu.id === jobType[0] ? child1 : child2
			};
		});
		const listData = newData;
		list.value = listData;

		defaultOpeneds.value = listData.map((item) => item.id);
	} catch (error) {}
	loading.value = false;
};

const onLazyLoad = async ({ node, key, done, fail }: any) => {
	const params = {
		limit: 10,
		ownerKind: 'Job',
		labelSelector: `controller-uid=${node.uid}`,
		sortBy: 'startTime',
		namespace: node.namespace
	};

	const res = await getNameSpacePodsList(params);
	const pods = res.data.items.map((item) => ObjectMapper.pods(item));
	const data = pods.map((item) => ({
		title: item.name,
		id: item.name,
		img: podIcon,
		status: item.podStatus.type,
		route: {
			path: `/jobs/pods/overview/${item.node}/${item.namespace}/${item.name}/${item.createTime}`
		}
	}));
	done(data);
};

onMounted(() => {
	fetchData();
});

watch(
	() => route.query.refresh,
	(newValue) => {
		if (newValue) {
			defaultActive.value = '';
			fetchData(false);
		}
	}
);
</script>

<style lang="scss" scoped></style>
