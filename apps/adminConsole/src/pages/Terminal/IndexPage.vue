<template>
	<div class="q-pa-lg">
		<q-input
			v-model="name"
			debounce="500"
			:placeholder="$t('SEARCH')"
			clearable
			@keyup.enter="getPodListData"
		/>

		<div class="row q-mt-md">
			<div>pod/container列表(点击container name创建连接)：</div>
			<div v-if="name">
				<div v-for="pod in podList" :key="pod.uid">
					<span class="">{{ pod.name }}</span>
					<div
						style="margin-left: 24px;cursor: pointer;"
						v-for="container in pod.spec.containers"
						:key="`${pod.uid}-${container.name}`"
						class="text-blue"
					>
						<div @click="clickHandler(pod, container)">
							{{ container.name }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="q-mt-md">
			<div>
				<span>收藏夹：</span>
				<q-btn
					color="primary"
					dense
					v-for="item in collectionList"
					:key="item.key"
					:disable="item.key === terminalKey"
					style="margin-right: 12px"
					no-caps
					size="12px"
				>
					<span @click="collectionClickHandler(item)">{{
						item.container
					}}</span>
					<q-icon
						size="sm"
						color="white"
						name="close"
						@click.stop="collectionDelete(item)"
					/>
				</q-btn>
			</div>
			<div>
				路径：<span>{{ terminalKey }}</span>
				<QButtonStyle>
					<q-btn
						flat
						dense
						no-caps
						icon="add_to_photos"
						@click="collectHandler"
					>
						<q-tooltip anchor="top middle" self="bottom middle">
							点击收藏此链接
						</q-tooltip>
					</q-btn>
				</QButtonStyle>
			</div>
		</div>
	</div>
	<Terminal
		ref="terminalRef"
		flat
		:key="terminalKey"
		:data="terminalData"
	></Terminal>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPodsList } from 'src/network';
import { ObjectMapper } from 'src/utils/object.mapper';
import { componentName } from 'src/router/const';
import Terminal from '@packages/ui/src/containers/TerminalContent.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import { onMounted } from 'vue';
import { uniq } from 'lodash';
import { useQuasar } from 'quasar';
const $q = useQuasar();

const router = useRouter();
const terminalRef = ref();
const podList = ref();
const name = ref('');
const route = useRoute();
const collections = ref([]);

const terminalData = computed(() => ({
	namespace: route.params.namespace,
	podName: route.params.pods_name,
	container: route.params.name
}));

const collectionList = computed(() =>
	collections.value.map((item) => keyToObject(item))
);

const terminalKey = computed(
	() =>
		`${terminalData.value.namespace}/${terminalData.value.podName}/${terminalData.value.container}`
);
const getPodListData = () => {
	const params = {
		name: name.value,
		sortBy: 'startTime'
	};
	$q.loading.show();
	getPodsList(params).then((res) => {
		podList.value = res.data.items.map((item) => ObjectMapper.pods(item));
		$q.loading.hide();
	});
};

const clickHandler = (pod, container) => {
	const params = {
		namespace: pod.namespace,
		pods_name: pod.name,
		name: container.name
	};
	routeReplace(params);
};

const routeReplace = (params) => {
	router.replace({
		name: componentName.TERMINAL_APP,
		params
	});
};

const TERMINAL_MAP = 'TERMINAL_MAP';
const collectHandler = () => {
	const data = collections.value;
	data.push(terminalKey.value);

	collections.value = uniq(data);
	setStorage();
};

const setStorage = () => {
	localStorage.setItem(TERMINAL_MAP, JSON.stringify(collections.value));
};

const collectionClickHandler = (item: any) => {
	const { key, ...rest } = item;
	terminalData.value = rest;

	const params = {
		namespace: item.namespace,
		pods_name: item.podName,
		name: item.container
	};
	routeReplace(params);
};

const collectionDelete = (item) => {
	collections.value = collections.value.filter((child) => child !== item.key);
	setStorage();
};

onMounted(() => {
	const data = localStorage.getItem(TERMINAL_MAP);

	if (data) {
		collections.value = JSON.parse(data);
	}
});

const keyToObject = (str) => {
	const arr = str.split('/');
	return {
		namespace: arr[0],
		podName: arr[1],
		container: arr[2],
		key: str
	};
};
</script>

<style></style>
