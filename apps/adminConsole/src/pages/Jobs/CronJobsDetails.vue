<template>
	<MyContentPage>
		<MyPage2>
			<template #extra>
				<div class="col-auto">
					<MoreSelection :options="options" size="md"></MoreSelection>
				</div>
			</template>
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { t } from 'src/boot/i18n';
import EnvironmentVariables from 'src/containers/EnvironmentVariables.vue';
import Yaml from 'src/pages/NamespacePods/Yaml.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import { getCornJobsDetail, getJobEvent } from 'src/network';
import { API_VERSIONS, MODULE_KIND_MAP } from 'src/utils/constants';
import { useRoute } from 'vue-router';
import { ObjectMapper } from '@packages/ui/src/utils/object.mapper';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { get, isEmpty, orderBy } from 'lodash';
import MyPage2 from '@packages/ui/src/containers/MyPage2.vue';
import MyCar4 from '@packages/ui/src/components/MyCard2.vue';
import MetadataVue from '@packages/ui/src/containers/Metadata.vue';
import { getLocalTime, joinSelector } from 'src/utils';
import Event from '@packages/ui/src/containers/Event.vue';
import Refresh from '@packages/ui/src/components/Refresh.vue';

const module = 'cronjobs';
const apiVersion = API_VERSIONS[module];
const detail = ref<any>({});
const evnetList = ref();
const route = useRoute();
const yamlRef = ref();
const loading = ref(false);
const loading2 = ref(false);
const options = [
	{
		label: t('EDIT_YAML'),
		value: 'edit',
		icon: 'sym_r_edit',
		onClick: () => {
			yamlRef.value.show();
		}
	}
];

const metadata = computed(() => get(detail.value, '_originData.metadata', {}));

const attrData = computed(() => getAttrs());

const getCronJobStatus = (spec) => {
	if (spec.suspend) {
		return 'Paused';
	}
	return 'running';
};

const detailData = detail.value || {};
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
