<template>
	<q-tree
		v-if="chartNodes && chartNodes.length > 0 && chartNodes[0].children"
		ref="treeRef"
		dense
		:nodes="chartNodes"
		node-key="path"
		label-key="label"
		selected-color="ink-1"
		:selected="selected"
		v-model:expanded="expanded"
		@update:selected="onSelected"
		@update:expanded="onExpanded"
		no-selection-unset
		no-results-label=" "
		no-nodes-label=" "
		text-color="ink-2"
		class="my-tree-wrapper"
		@lazy-load="onLazyLoad"
	>
		<template v-slot:default-header="prop">
			<div
				:id="prop.node.key"
				class="my-tree-header-container"
				@mouseenter="mouseenter(prop.node.path)"
				@mouseleave="mouseleave(prop.node.path)"
			>
				<div
					class="row no-wrap items-center justify-between my-tree-header-wrapper"
					:id="prop.node.key"
				>
					<div class="row items-center justify-start">
						<img
							v-if="!prop.node.isDir"
							class="q-mx-xs"
							src="../../assets/icon-txt.svg"
							style="width: 12px"
						/>

						<span
							style="
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							"
							>{{ prop.node.label }}</span
						>
					</div>

					<q-icon
						class="horiz"
						:class="{ 'hide-horiz': mouseItemKey === prop.node.path }"
						rounded
						clickable
						name="sym_r_more_horiz"
						size="18px"
						@click.stop
					>
						<PopupMenu
							:items="
								prop.node.isDir ? [...fileMenu, ...operateMenu] : operateMenu
							"
							:path="prop.node.path"
							:label="prop.node.label"
							@handleEvent="handleEvent"
						/>
					</q-icon>
				</div>
			</div>
		</template>
	</q-tree>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { ApplicationInfo, FilesSelectType, OPERATE_ACTION } from '@/types/core';
import { BtDialog } from '@bytetrade/ui';
import { useDevelopingApps } from '../../stores/app';
import { useDockerStore } from '../../stores/docker';

import PopupMenu from '../common/PopupMenu.vue';
import CreateFile from '../../components/dialog/CreateFile.vue';
import DialogConfirm from '../../components/dialog/DialogConfirm.vue';

const props = defineProps({
	app: {
		type: Object as PropType<ApplicationInfo>,
		required: true
	},
	selected: {
		type: String,
		required: true,
		default: ''
	},
	chartNodes: {
		type: Object as PropType<FilesSelectType[]>,
		required: true
	}
});

const emits = defineEmits(['onSelected', 'updatePathNode']);

const { t } = useI18n();
const $q = useQuasar();
const store = useDevelopingApps();
const dockerStore = useDockerStore();

const expanded = ref<string[]>([props.app.appName]);
const mouseItemKey = ref();

const fileMenu = ref([
	{
		label: t(`enums.${OPERATE_ACTION.ADD_FOLDER}`),
		name: OPERATE_ACTION.ADD_FOLDER,
		icon: 'sym_r_create_new_folder'
	},
	{
		label: t(`enums.${OPERATE_ACTION.ADD_FILE}`),
		name: OPERATE_ACTION.ADD_FILE,
		icon: 'sym_r_note_add'
	}
]);

const operateMenu = ref([
	{
		label: t(`enums.${OPERATE_ACTION.RENAME}`),
		name: OPERATE_ACTION.RENAME,
		icon: 'sym_r_edit_square'
	},
	{
		label: t(`enums.${OPERATE_ACTION.DELETE}`),
		name: OPERATE_ACTION.DELETE,
		icon: 'sym_r_delete'
	}
]);

const onLazyLoad = async ({ node, done }) => {
	const res = await loadChildren(node);
	done(res);
};

const loadChildren = async (node: any) => {
	const res: any = await axios.get(store.url + '/api/files/' + node.path);

	const setChildren = (n: any, path: any, children: any) => {
		for (let i in n) {
			if (n[i].path == path && n[i].isDir) {
				n[i].children = children;
				return;
			}

			if (n[i].isDir && n[i].children.length > 0) {
				setChildren(n[i].children, path, children);
			}
		}
	};

	const children = getChildren(res.items);
	return children;
};

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

const onSelected = async (value) => {
	emits('onSelected', value);
};

const onExpanded = (value) => {
	expanded.value = value;
};

const mouseenter = (key: string) => {
	mouseItemKey.value = key;
};

const mouseleave = (key: string) => {
	mouseItemKey.value = null;
};

const handleEvent = (action: OPERATE_ACTION, path: string, label: string) => {
	switch (action) {
		case OPERATE_ACTION.ADD_FOLDER:
			createDialog(path, action);
			break;

		case OPERATE_ACTION.ADD_FILE:
			createDialog(path, action);
			break;

		case OPERATE_ACTION.RENAME:
			renameDialog(path, label, action);
			break;

		case OPERATE_ACTION.DELETE:
			deleteFile(path);
			break;
	}
};

const createDialog = (path: string, action: OPERATE_ACTION) => {
	$q.dialog({
		component: CreateFile,
		componentProps: {
			path,
			action
		}
	}).onOk(() => {
		emits('updatePathNode', path);
	});
};

const renameDialog = (path: string, label: string, action: OPERATE_ACTION) => {
	$q.dialog({
		component: CreateFile,
		componentProps: {
			path,
			action,
			label
		}
	}).onOk(() => {
		const parentPath = path.split('/').slice(0, -1).join('/');
		emits('updatePathNode', parentPath);
	});
};

const deleteFile = async (path: string) => {
	const target_name = path.substring(path.lastIndexOf('/') + 1);

	$q.dialog({
		component: DialogConfirm,
		componentProps: {
			title: t('btn_delete'),
			message: t('message.deleteTip', { name: target_name })
		}
	}).onOk(async () => {
		_deleteFile(path);
	});
};

const _deleteFile = async (path: string) => {
	const parentPath = path.split('/').slice(0, -1).join('/');
	await dockerStore.deleteFile(path);
	emits('updatePathNode', parentPath);
};
</script>

<style lang="scss" scoped>
.horiz {
	opacity: 0;
}
.hide-horiz {
	opacity: 1;
}

.my-tree-wrapper {
	width: calc(100% - 10px);

	$my_tree_width_base: 8px;
	$my_tree_left: -($my_tree_width_base + 8px);
	&::v-deep(.q-tree) {
		padding: 0 20px;
	}
	&::v-deep(.q-tree--dense .q-tree__node--child > .q-tree__node-header:before) {
		width: 12px;
	}
	&::v-deep(.q-tree--dense .q-tree__node-header:before) {
		width: 12px;
	}
	&::v-deep(.q-tree--dense .q-tree__node--child) {
		padding-left: $my_tree_width_base;
	}
	&::v-deep(.q-tree--dense .q-tree__node--child > .q-tree__node-header:before) {
		left: $my_tree_left;
	}

	&::v-deep(.q-tree__node-header-content) {
		font-weight: 500;
		color: #1f1814;
	}

	&::v-deep(.q-tree--dense .q-tree__arrow) {
		color: $ink-1;
	}

	&::v-deep(.q-tree__children .q-tree__node-header-content) {
		font-weight: 400;
		color: #5c5551;
	}
	&::v-deep(.q-tree__children .q-tree__node-header-content .header-top) {
		margin-right: map-get($space-sm, x);
	}

	&::v-deep(.q-tree__node-header) {
		padding-top: 2px;
		padding-bottom: 1px;
	}

	::v-deep(.q-tree__arrow) {
		font-size: 14px;
		border: 1px solid rgba(255, 255, 255, 0);
		color: $ink-1;
	}
	::v-deep(.q-tree__spinner) {
		font-size: 14px;
		border: 1px solid rgba(255, 255, 255, 0);
		color: $ink-1;
	}
}
::v-deep(.selected-node) {
	position: relative;
	&::after {
		content: '';
		position: absolute;
		left: -4px;
		right: 4px;
		top: 0;
		bottom: 0;
		background-color: rgba(34, 111, 255, 0.12);
		border-radius: 4px;
	}
}
.my-tree-header-container {
	width: 100%;
	position: relative;
	border-radius: 4px;
	.my-tree-badge-wrapper {
		margin-left: 4px;
	}
	.my-tree-avatar {
		position: relative;
		& ~ .my-tree-badge-wrapper {
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}
}
::v-deep(.q-tree .q-tree__node-header) {
	border-radius: 4px;
}
::v-deep(.q-tree .q-tree__node-header .q-focus-helper) {
	left: -6px;
	right: 0;
	width: auto;
	border-radius: 4px;
}

::v-deep(.q-focus-helper:has(+ .q-icon.q-tree__arrow)) {
	left: 0;
	right: 0;
	width: auto;
}

.my-tree-header-wrapper {
	padding: 4px 0;
	border-radius: 4px;
	padding-right: 8px;
	width: 100%;
}

::v-deep(.q-tree__node-header:before) {
	border-bottom-left-radius: 7px;
	border-color: $separator-2;
}
::v-deep(
		.q-tree__node--parent > .q-tree__node-collapsible > .q-tree__node-body:after
	) {
	border-color: #e0e0e0;
}
::v-deep(.q-tree__node:after) {
	border-color: $separator-2;
}
::v-deep(.my-menu-before-scroll .q-scrollarea__container) {
	overflow-x: hidden;
}
::v-deep(.my-menu-before-scroll .q-scrollarea__content) {
	min-width: initial;
	width: 100%;
}
::v-deep(.my-menu-before-scroll .q-tree__node-collapsible) {
	overflow-x: hidden;
}

::v-deep(.q-tree__node--selected) {
	background-color: $background-3;
}

::v-deep(
		.q-tree
			> .q-tree__node--parent
			> .q-tree__node-header
			> .q-tree__node-header-content
	) {
	color: $ink-1 !important;
}
::v-deep(
		.q-tree--dense
			.q-tree__node--parent
			> .q-tree__node-collapsible
			> .q-tree__node-body
	) {
	padding-bottom: 0px;
}
</style>
