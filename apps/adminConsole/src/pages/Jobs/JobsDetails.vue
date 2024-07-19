<template>
	<MyContentPage>
		<template #extra>
			<div class="col-auto">
				<MoreSelection :options="options" size="md"></MoreSelection>
			</div>
		</template>
		<MyPage2>
			<MyCar4 square flat :title="$t('RUN_RECORDS')">
				<QTableStyle>
					<q-table
						flat
						hide-pagination
						v-model:pagination="pagination"
						:rows="tableList"
						:columns="columns"
						row-key="name"
					>
						<template v-slot:body-cell-status="props">
							<q-td :props="props" class="row items-center">
								<Status :type="props.value"></Status>
								{{ $t(props.value.toUpperCase()) }}
							</q-td>
						</template>
					</q-table>
				</QTableStyle>
			</MyCar4>
			<MyCar4 square flat :title="$t('DETAILS')" :loading="loading">
				<DetailPage :data="attrData"></DetailPage>
			</MyCar4>

			<MetadataVue :data="metadata"></MetadataVue>

			<MyCar4 square flat :title="$t('EVENT_PL')">
				<template #extra>
					<Refresh @click="fetchEvent"></Refresh>
				</template>
				<Event :data="evnetList"></Event>
				<q-inner-loading :showing="loading2"> </q-inner-loading>
			</MyCar4>
		</MyPage2>
		<q-inner-loading :showing="loading"> </q-inner-loading>
	</MyContentPage>

	<Yaml2
		ref="yamlRef"
		:apiVersion="apiVersion"
		:name="detail.name"
		:namespace="detail.namespace"
		:originData="detail._originData"
		@hide="hideHandler"
		@change="fetchData"
	>
	</Yaml2>

	<DeleteDialog
		:title="`${$t('DELETE')} ${$t('JOB')}`"
		:desc="$t('CUSTOM_RESOURCE_LOW')"
		:name="detail.name"
		:loading="deleteLoading"
		ref="deleteDialogRef"
		@submit="confirmHandler"
		@hide="hideHandler"
	></DeleteDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { t } from 'src/boot/i18n';
import EnvironmentVariables from 'src/containers/EnvironmentVariables.vue';
import Yaml from 'src/pages/NamespacePods/Yaml.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import {
	getCornJobsDetail,
	getJobEvent,
	fetchListByK8s,
	jobRerun
} from 'src/network';
import { API_VERSIONS, MODULE_KIND_MAP } from 'src/utils/constants';
import { useRoute } from 'vue-router';
import { ObjectMapper } from '@packages/ui/src/utils/object.mapper';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { get, isEmpty, orderBy, upperCase } from 'lodash';
import MyPage2 from '@packages/ui/src/containers/MyPage2.vue';
import MyCar4 from '@packages/ui/src/components/MyCard2.vue';
import MetadataVue from '@packages/ui/src/containers/Metadata.vue';
import { getLocalTime, joinSelector } from 'src/utils';
import Event from '@packages/ui/src/containers/Event.vue';
import Refresh from '@packages/ui/src/components/Refresh.vue';
import QTableStyle from '@packages/ui/src/components/QTableStyle.vue';
import Status from '@packages/ui/src/components/Status.vue';
import Yaml2 from '../NamespacePods/Yaml2.vue';
import DeleteDialog from '@packages/ui/src/components/DeleteDialog.vue';

const module = 'jobs';
const apiVersion = API_VERSIONS[module];
const detail = ref<any>({});
const evnetList = ref();
const route = useRoute();
const yamlRef = ref();
const loading = ref(false);
const loading2 = ref(false);
const tableList = ref([]);
const deleteDialogRef = ref();
const deleteLoading = ref(false);
const options = [
	{
		label: t('RERUN'),
		value: 'refresh',
		icon: 'sym_r_refresh',
		onClick: () => {
			rerunHanlder();
		}
	},
	{
		label: t('EDIT_YAML'),
		value: 'edit',
		icon: 'sym_r_edit',
		onClick: () => {
			yamlRef.value.show();
		}
	},
	{
		label: t('DELETE'),
		value: 'delete',
		icon: 'sym_r_delete',
		onClick: () => {
			deleteDialogRef.value && deleteDialogRef.value.show();
		}
	}
];

const metadata = computed(() => get(detail.value, '_originData.metadata', {}));

const attrData = computed(() => getAttrs());
const pagination = ref({
	rowsNumber: 0
});
const getCronJobStatus = (spec) => {
	if (spec.suspend) {
		return 'Paused';
	}
	return 'running';
};

const detailData = detail.value || {};

const columns = [
	// {
	// 	label: t('JOB'),
	// 	name: 'name',
	// 	field: 'name'
	// },
	// {
	// 	label: t('STATUS'),
	// 	name: 'status',
	// 	field: 'status'
	// },
	// {
	// 	label: t('START_TIME'),
	// 	name: 'status.startTime',
	// 	field: (row) => row.status.startTime
	// },
	// {
	// 	label: t('END_TIME'),
	// 	name: 'status.completionTime',
	// 	field: (row) => row.status.completionTime
	// }

	{
		label: t('SN_NO'),
		name: 'id',
		field: 'id',
		align: 'left'
	},
	{
		label: t('STATUS'),
		name: 'status',
		field: 'status',
		align: 'left'
	},
	{
		label: t('MESSAGE'),
		name: 'messages',
		field: (row) => get(row, 'messages[0]') || '-',
		align: 'left'
	},
	{
		label: t('START_TIME'),
		name: 'start-time',
		field: (row) =>
			getLocalTime(row['start-time']).format('YYYY-MM-DD HH:mm:ss'),
		align: 'left'
	},
	{
		label: t('END_TIME'),
		name: 'completion-time',
		field: (row) =>
			getLocalTime(row['completion-time']).format('YYYY-MM-DD HH:mm:ss'),
		align: 'left'
	}
];
const getAttrs = () => {
	if (isEmpty(detail.value)) {
		return;
	}
	const { spec = {} } = detail.value || { spec: {} };
	const status = getCronJobStatus(spec);

	const { namespace, name }: Record<string, any> = route.params;

	return [
		{
			name: t('CLUSTER'),
			value: 'default'
		},
		{
			name: t('PROJECT'),
			value: namespace
		},
		{
			name: t('STATUS'),
			value: t(status)
		},
		{
			name: t('SCHEDULE'),
			value: spec.schedule
		},
		{
			name: t('MAXIMUM_DELAY'),
			value: spec.startingDeadlineSeconds
		},
		{
			name: t('SUCCESSFUL_JOBS_RETAINED'),
			value: spec.successfulJobsHistoryLimit
		},
		{
			name: t('FAILED_JOBS_RETAINED'),
			value: spec.failedJobsHistoryLimit
		},
		{
			name: t('CONCURRENCY_POLICY'),
			value:
				spec.concurrencyPolicy === 'Allow'
					? t('RUN_JOBS_CONCURRENTLY')
					: spec.concurrencyPolicy === 'Forbid'
					? t('SKIP_NEW_JOB')
					: t('SKIP_OLD_JOB')
		},
		{
			name: t('CREATION_TIME_TCAP'),
			value: getLocalTime(detail.value.createTime).format('YYYY-MM-DD HH:mm:ss')
		},
		{
			name: t('CREATOR'),
			value: detail.value.creator
		}
	];
};

const fetchData = async () => {
	const { namespace, name }: Record<string, any> = route.params;
	const params = {};
	loading.value = true;
	try {
		const { data } = await getCornJobsDetail(
			apiVersion,
			namespace,
			module,
			name,
			params
		);
		detail.value = ObjectMapper[module](data);
		fetchEvent();
		fetchRecords();
	} catch (error) {}
	loading.value = false;
};

const kind = MODULE_KIND_MAP[module];

const fetchEvent = async () => {
	const { uid, name, namespace, _originData = {} } = detail.value;

	const fields = {
		'involvedObject.name': name,
		'involvedObject.namespace': namespace,
		'involvedObject.kind': _originData.kind || kind,
		'involvedObject.uid': uid
	};
	loading2.value = true;
	try {
		const {
			data: { items }
		} = await getJobEvent({
			namespace,
			cluster: '',
			fieldSelector: joinSelector(fields)
		});
		evnetList.value = orderBy(items.map(ObjectMapper.events), 'lastTimestamp');
	} catch (error) {}

	loading2.value = false;
};

const fetchRecords = async (params = {}) => {
	const { cluster, namespace, name } = detail.value;
	const selector = get(detail.value, 'spec.jobTemplate.metadata.labels', {});

	const { data } = await fetchListByK8s({
		...params,
		cluster,
		namespace,
		selector,
		module,
		name
	});

	const temp = ObjectMapper[module](data);

	const records = JSON.parse(get(temp, 'annotations.revisions', {}));
	tableList.value = Object.entries(records).map(([key, value]) => {
		const typedValue = value as Record<string, any>;

		return {
			...typedValue,
			id: key
		};
	});
};

const hideHandler = () => {
	currentYamlData.value = {};
};

const confirmHandler = () => {
	//
};

const rerunHanlder = async () => {
	const { namespace, name }: Record<string, any> = route.params;
	const params = {};
	loading.value = true;

	try {
		const { data } = await getCornJobsDetail(
			apiVersion,
			namespace,
			module,
			name,
			params
		);
		const resourceVersion = get(data, 'metadata.resourceVersion');
		console.log('resourceVersion', resourceVersion);

		jobRerun(resourceVersion, { name, namespace });
	} catch (error) {}
};

watch(
	() => route.params.name,
	() => {
		fetchData();
	},
	{
		immediate: true
	}
);
</script>
