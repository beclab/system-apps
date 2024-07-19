<template>
	<div class="yaml-container">
		<q-btn
			v-if="$slots.default"
			no-caps
			@click="yamlShow"
			flat
			outline
			color="primary"
		>
			<slot></slot>
		</q-btn>
		<q-dialog
			persistent
			full-width
			full-height
			v-model="visible2"
			@show="show"
			@hide="hide"
		>
			<q-card>
				<div class="row items-center q-pa-md">
					<div class="q-h6">{{ title }}</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</div>
				<div class="relative-position" style="height: calc(100vh - 158px)">
					<div
						style="
							height: calc(100%);
							border-radius: 6px;
							overflow: hidden;
							position: relative;
						"
						class="q-mx-sm q-b-sm"
					>
						<!-- <q-btn
            color="primary"
            dense
            rounded
            padding="xs md"
            class="yaml-tool-container"
          >
            <q-uploader v-model="fileList" :auto-upload="false" accept=".yaml">
              <template v-slot:header>
                <q-icon name="upload" />
              </template>
            </q-uploader>
            <q-icon dense name="upload" @click="handleDownload" />
            <q-separator spaced inset vertical dark />
            <q-icon name="download" @click="handleDownload" />
          </q-btn> -->
						<v-ace-editor
							v-if="aceVisileb"
							v-model:value="data"
							lang="yaml"
							theme="chaos"
							:readonly="loading2"
							style="height: calc(100%)"
							:options="{
								showGutter: true,
								showPrintMargin: false,
								useWorker: true,
								keyboardHandler: 'vscode',
								wrapEnabled: true,
								tabSize: 2,
								wrap: true
							}"
						/>
					</div>
					<q-card-section class="row justify-end q-pa-sm">
						<q-btn
							no-caps
							unelevated
							outline
							rounded
							padding="6px xl"
							@click="yamlHide"
						>
							<span>{{ t('CANCEL') }}</span>
						</q-btn>
						<q-btn
							no-caps
							color="primary"
							unelevated
							rounded
							padding="6px xl"
							style="margin-left: 12px"
							:loading="loading2"
							@click="submit"
						>
							{{ t('OK') }}
						</q-btn>
					</q-card-section>
				</div>
			</q-card>
			<q-inner-loading :showing="loading"> </q-inner-loading>
		</q-dialog>
	</div>
</template>

<script setup lang="ts">
import {
	getWorkloadsControler,
	getYaml,
	updateWorkloadsControler,
	getDetail,
	updateDetail
} from 'src/network';
import { computed, onMounted, ref, watch } from 'vue';
import yaml, { load } from 'js-yaml';
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-yaml';
// import 'ace-builds/src-noconflict/snippets/yaml';
// import 'ace-builds/src-noconflict/theme-textmate';

import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/mode-groovy';
import 'ace-builds/src-noconflict/theme-chaos';
// import 'ace-builds/src-noconflict/keybinding-vscode';
import 'ace-builds/src-noconflict/ext-searchbox';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import workerJsonUrl from 'file-loader?esModule=false!ace-builds/src-noconflict/worker-yaml.js';
import { objectToYaml, yamlToObject } from './yaml';
import { useRoute } from 'vue-router';
import { Loading, Notify, useQuasar } from 'quasar';
import { ObjectMapper } from 'src/utils/object.mapper';
import { t } from 'src/boot/i18n';
import { get, set } from 'lodash-es';
import { saveAs } from 'file-saver';
import { API_VERSIONS } from 'src/utils/constants';
import { cloneDeep, setWith } from 'lodash';
ace.config.setModuleUrl('ace/mode/yaml_worker', workerJsonUrl);
// src/components/Modals/EditYaml/index.jsx
interface Props {
	title?: string;
	name?: string;
	module?: 'secrets';
	namespace?: string;
}

const emits = defineEmits(['change']);

const $q = useQuasar();

const props = withDefaults(defineProps<Props>(), {});

const data = ref();
const detail = ref();
const visible2 = ref(false);
const aceVisileb = ref(false);
const loading = ref(false);
const loading2 = ref(false);
const theme = ref('chaos');
const fileList = ref();
const mode = computed(() => {
	const { kind } = route.params as Record<string, string>;

	switch (kind) {
		case 'deployments':
			return 'deployment';
		case 'statefulsets':
			return 'statefulset';
		case 'daemonsets':
			return 'daemonset';
		case 'persistentvolumeclaims':
			return 'persistentvolumeclaims';
		default:
			return 'deployment';
	}
});

const route = useRoute();

const yamlShow = () => {
	visible2.value = true;
};

const yamlHide = () => {
	visible2.value = false;
};

const show = (evt: Event) => {
	fetchData();
	aceVisileb.value = true;
};

const hide = (evt: Event) => {
	aceVisileb.value = false;
	data.value = undefined;
};

const apiVersion = API_VERSIONS[props.module] || '';

const fetchData = () => {
	const { namespace, kind, name } = route.params as Record<string, string>;
	const type = props.module || kind;
	loading.value = true;
	getDetail(apiVersion, {
		namespace: props.namespace || namespace,
		kind: type,
		name: props.name || name
	})
		.then((res) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			detail.value = ObjectMapper[type](res.data);
			data.value = objectToYaml(detail.value._originData);
		})
		.finally(() => {
			loading.value = false;
		});
};

const saveAsFile = (text = '', fileName = 'default.txt') => {
	const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
	saveAs(blob, fileName);
};

const handleDownload = () => {
	let value = data.value;
	let template;
	if (value.metadata) {
		template = value;
	} else {
		const values: any = Object.values(value);
		if (values && values[0] && values[0].metadata) {
			template = values[0];
		}
	}
	const name = get(template, 'metadata.name', 'default');
	const namespace = get(template, 'metadata.namespace', '');
	const kind = get(template, 'kind', '').toLowerCase();
	const fileName = [name, namespace, kind].filter((item) => item).join('.');
	saveAsFile(value, `${fileName}.${mode.value}.yaml`);
};

const submit = async () => {
	let newData = data.value;
	set(newData, 'metadata.resourceVersion', detail.value.resourceVersion);
	update(detail, newData);
};

const update = async (
	params: Record<string, any>,
	data: Record<string, any>
) => {
	let newObject = yamlToObject(data, false)[0];
	try {
		loading2.value = true;
		const { namespace, kind, name } = route.params as Record<string, string>;
		const type = props.module || kind;

		const params = {
			namespace: props.namespace || namespace,
			kind: type,
			name: props.name || name
		};
		loading.value = true;
		const { data: result } = await getDetail(apiVersion, params);

		const resourceVersion = get(result, 'metadata.resourceVersion');
		if (resourceVersion) {
			set(newObject, 'metadata.resourceVersion', resourceVersion);
		}
		newObject = objectToYaml(newObject);
		const obj = yamlToObject(newObject, false);
		const { data } = await updateDetail(apiVersion, params, obj[0]);
		yamlHide();
		emits('change');
	} catch {
		//
	}
	loading2.value = false;
	loading.value = false;
};

const handleFileAdded = (file: any) => {
	if (file.type === 'application/x-yaml') {
		fileList.value = [file];
	} else {
		fileList.value = [];
	}
};

const handleFileFailed = (err: any, file: any) => {
	fileList.value = [];
};

defineExpose({
	show: yamlShow
});
</script>

<style lang="scss" scoped>
.yaml-container {
	font-family: 'Roboto';
}
.yaml-tool-container {
	position: absolute;
	top: 8px;
	right: 8px;
	z-index: 1;
}
</style>
