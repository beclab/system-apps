<template>
	<div class="files row">
		<div class="files-left">
			<app-tree
				:app="app"
				:selected="selected"
				:chartNodes="chartNodes"
				@on-selected="onSelected"
				@update-path-node="updatePathNode"
			/>
		</div>

		<div class="files-right col-9">
			<app-edit-file
				:fileInfo="fileInfo"
				:isEditing="isEditing"
				@on-save-file="onSaveFile"
				@change-code="changeCode"
				@editorMount="editorMount"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { ref, watch, onMounted, PropType, reactive } from 'vue';
import { BtDialog, BtNotify, NotifyDefinedType } from '@bytetrade/ui';
import { ApplicationInfo, FilesSelectType, FilesCodeType } from '@/types/core';

import { useDevelopingApps } from '../stores/app';
import { useDockerStore } from './../stores/docker';

import AppTree from './common/AppTree.vue';
import AppEditFile from './common/AppEditFile.vue';

const props = defineProps({
	app: {
		type: Object as PropType<ApplicationInfo>,
		required: true
	}
});

const store = useDevelopingApps();
const dockerStore = useDockerStore();

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const chartNodes = ref<any>([]);
const tempFile = ref();
const isEditing = ref(false);
const selected = ref(props.app.chart);

const fileInfo = reactive<FilesCodeType>({
	code: '',
	lang: 'json',
	name: ''
});

onMounted(async () => {
	const fileParamsPath = route.path.split('/').slice(2);
	if (fileParamsPath && fileParamsPath.length > 0) {
		updateRoute(fileParamsPath.join('/'));
	}

	await loadChart();
});

window.onbeforeunload = function (e) {
	if (isEditing.value) {
		var ev = window.event || e;
		ev.returnValue = `${fileInfo.name} has been modified. Do you want to save the changes and update the chart repository?'`;
	}
};

watch(
	() => fileInfo.code,
	(newVal) => {
		if (newVal !== tempFile.value) {
			isEditing.value = true;
		} else {
			isEditing.value = false;
		}
	}
);

const changeCode = (value) => {
	fileInfo.code = value;
};

async function onSaveFile() {
	if (!selected.value) return false;
	await axios.put(store.url + '/api/files/' + selected.value, fileInfo.code, {
		headers: { 'content-type': 'text/plain' }
	});

	isEditing.value = false;
	BtNotify.show({
		type: NotifyDefinedType.SUCCESS,
		message: t('message.save_file_success')
	});
}

const getChildren = (items: any) => {
	let children: FilesSelectType[] = [];

	for (let n in items) {
		const data = items[n];
		const selectData: FilesSelectType = {
			label: data.name,
			icon: data.isDir ? 'folder' : 'article',
			path: data.path,
			expandable: data.isDir,
			selectable: !data.isDir,
			children: data.isDir ? [{}] : null,
			isDir: data.isDir,
			lazy: data.isDir ? true : false
		};
		children.push(selectData);
	}

	return children;
};

async function loadChart() {
	const res: any = await axios.get(store.url + '/api/files' + props.app.chart);

	const children = getChildren(res.items);
	chartNodes.value = [
		{
			label: props.app.appName,
			icon: 'folder',
			children: children,
			selectable: false,
			path: props.app.appName,
			isDir: true
		}
	];
}

const updatePathNode = async (path: string) => {
	const res: any = await axios.get(store.url + '/api/files/' + path);

	const children = getChildren(res.items);

	const replaceNodes = replaceObjectByPath(chartNodes.value, path, children);

	chartNodes.value = replaceNodes;
};

function replaceObjectByPath(array, targetPath, newObject) {
	return array.map((item) => {
		if (item.path === targetPath) {
			item.children = newObject;
			return item;
		}

		if (item.children && Array.isArray(item.children)) {
			return {
				...item,
				children: replaceObjectByPath(item.children, targetPath, newObject)
			};
		}

		return item;
	});
}

const updateRoute = (value) => {
	selected.value = value;
	router.push({
		path: `/app/${value}`
	});
};

const onSelected = async (value) => {
	if (isEditing.value) {
		checkFileSave(value);
	} else {
		fetchData(value);
		updateRoute(value);
	}
};

const fetchData = async (value) => {
	await dockerStore.getFile(value);

	isEditing.value = false;
	tempFile.value = dockerStore.currentFileData.content
		? dockerStore.currentFileData.content
		: '';
	fileInfo.code = dockerStore.currentFileData.content
		? dockerStore.currentFileData.content
		: '';
	// fileInfo.lang = dockerStore.currentFileData.extension;
	fileInfo.name = dockerStore.currentFileData.name;

	// router.push({
	// 	path: `/app/${props.app.appName}/${Encoder.stringToBase64Url(value)}`
	// });
};

const checkFileSave = (value) => {
	BtDialog.show({
		platform: 'web',
		cancel: true,
		okStyle: {
			background: '#00BE9E',
			color: '#ffffff'
		},
		title: t('message.confirmation'),
		message: t('message.save_file')
	})
		.then(async (val) => {
			if (val) {
				await onSaveFile();
				updateRoute(value);
				fetchData(value);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

const editorMount = () => {
	if (selected.value === props.app.chart) {
		if (chartNodes.value && chartNodes.value.length > 0) {
			const defaultFile = chartNodes.value[0].children.find(
				(item) => !item.isDir
			);

			console.log('defaultFile', defaultFile);
			updateRoute(defaultFile.path);
			fetchData(defaultFile.path);
		}
	} else {
		fetchData(selected.value);
	}
};
</script>

<style lang="scss" scoped>
.files {
	height: calc(100vh - 56px);

	.files-left {
		width: 260px;
		background-color: $background-1;
		padding: 20px;
	}
	.files-right {
		flex: 1;
		overflow: hidden;
		background: $background-3;
		padding: 20px;
	}
}
</style>
