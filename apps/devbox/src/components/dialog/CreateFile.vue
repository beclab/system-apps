<template>
	<bt-custom-dialog
		ref="CustomRef"
		:title="title"
		:cancel="true"
		:okLoading="loading"
		size="small"
		@onSubmit="submit"
	>
		<div class="form-item">
			<div class="text-subtitle2 text-ink-3 q-mb-xs">
				{{ t('dialog_create_title') }}
			</div>
			<div class="form-item-value q-mb-lg">
				<q-input
					ref="fileNameRef"
					dense
					borderless
					no-error-icon
					v-model="appName"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.file.placeholder"
					:rules="ruleConfig.file.rules"
				>
				</q-input>
			</div>
		</div>
	</bt-custom-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ruleConfig } from './../../types/config';
import { useDockerStore } from './../../stores/docker';
import { OPERATE_ACTION } from '@/types/core';

const props = defineProps({
	path: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: false
	},
	action: {
		type: String,
		required: false,
		default: OPERATE_ACTION.ADD_FILE
	}
});

const { t } = useI18n();

const dockerStore = useDockerStore();

const CustomRef = ref();
const fileNameRef = ref();
const loading = ref(false);
const appName = ref(props.label || '');
const title = ref();

const submit = async () => {
	console.log('click submit');
	fileNameRef.value.validate();
	if (fileNameRef.value.hasError) return;

	switch (props.action) {
		case OPERATE_ACTION.ADD_FILE:
			await createFile();
			break;

		case OPERATE_ACTION.ADD_FOLDER:
			await createFolder();
			break;

		case OPERATE_ACTION.RENAME:
			await renameFile();
			break;
	}

	CustomRef.value.onDialogOK();
};

const createFile = async () => {
	const currentPath = `${props.path}/${appName.value}`;
	await dockerStore.putFile(currentPath);
};

const createFolder = async () => {
	const currentPath = `${props.path}/${appName.value}`;
	await dockerStore.createFolder(currentPath);
};

const renameFile = async () => {
	const newPath = props.path.replace(props.label!, appName.value);
	const currentPath = `${props.path}?action=rename&destination=${newPath}`;

	await dockerStore.pathFile(
		currentPath,
		{},
		{
			headers: { 'content-type': 'text/plain' }
		}
	);
};

onMounted(() => {
	switch (props.action) {
		case OPERATE_ACTION.ADD_FILE:
			title.value = t('dialog_create_file');
			break;

		case OPERATE_ACTION.ADD_FOLDER:
			title.value = t('dialog_create_folder');
			break;

		case OPERATE_ACTION.DELETE:
			title.value = t('message.rename_file');
			break;

		default:
			title.value = t('dialog_create_file');
			break;
	}
});
</script>

<style lang="scss" scoped>
.form-item {
	.form-item-key {
		width: 100px;
		height: 40px;
		line-height: 40px;
		text-align: center;
	}
	.form-item-value {
		flex: 1;
	}
}
</style>
