<template>
	<my-card no-content-gap square flat animated>
		<template #title>
			<div>{{ t('DATA') }}&nbsp;</div>
		</template>
		<template #extra>
			<div class="row items-center q-gutter-x-md">
				<span>{{ secret }}</span>
				<QButtonStyle size="sm">
					<q-btn
						color="grey-5"
						flat
						dense
						no-caps
						size="sm"
						:icon="
							secretValueVisible ? 'sym_r_visibility_off' : 'sym_r_visibility'
						"
						@click="secretValueVisibleHandler"
					>
					</q-btn>
				</QButtonStyle>
			</div>
		</template>
		<DataDetail :data="secretObj"> </DataDetail>
	</my-card>
	<my-card square flat animated :title="t('KUBECONFIG_SETTINGS')" v-if="yaml">
		<div
			class="service-desc-wrapper"
			v-html="t('SERVICEACCOUNT_KUBECONFIG_DESC')"
		></div>
		<Yaml
			class="q-mt-md"
			style="height: 480px"
			:data="getValue(kubeconfig)"
		></Yaml>
		<q-inner-loading :showing="loading2" style="z-index: 9999">
		</q-inner-loading>
	</my-card>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import {
	onMounted,
	ref,
	withDefaults,
	defineProps,
	watch,
	computed
} from 'vue';
import { getSecretsData } from 'src/network';
import MyLoading from 'src/components/MyLoading.vue';
import { get } from 'lodash';
import { t } from 'src/boot/i18n';
import DataDetail from '@packages/ui/src/containers/DataDetail.vue';
import { safeBtoa } from '@packages/ui/src/utils/base64';
import Yaml from 'src/containers/Yaml.vue';
import { getValue } from 'src/utils/yaml';
import { ObjectMapper } from '@packages/ui/src/utils/object.mapper';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';

interface Props {
	secret?: string;
	yaml?: boolean;
	serviceAccountName?: string;
}

const loading2 = ref(false);
const route = useRoute();
const secretsData: any = ref({});
const secretValueVisible = ref(false);

const props = withDefaults(defineProps<Props>(), {
	yaml: false
});

const secretObj = computed(() => {
	if (!secretValueVisible.value) {
		const obj = {};
		for (const key in secretsData.value.data) {
			obj[key] = safeBtoa(secretsData.value.data[key]);
		}
		return obj;
	}
	return secretsData.value.data;
});
const kubeconfig = computed(() => {
	const { cluster, namespace }: any = route.params;

	return {
		apiVersion: 'v1',
		kind: 'Config',
		clusters: [
			{
				name: `${props.serviceAccountName}@local`,
				cluster: {
					server: 'https://kubernetes.default.svc:443',
					'certificate-authority-data': safeBtoa(
						get(secretsData.value, 'data["ca.crt"]')
					)
				}
			}
		],
		users: [
			{
				name: props.serviceAccountName,
				user: {
					token: get(secretsData.value, 'data.token')
				}
			}
		],
		contexts: [
			{
				name: `${props.serviceAccountName}@local`,
				context: {
					user: props.serviceAccountName,
					cluster: `${props.serviceAccountName}@local`,
					namespace
				}
			}
		],
		'current-context': `${props.serviceAccountName}@local`
	};
});

const fetchSecretsData = () => {
	const { namespace, type, name }: any = route.params;
	const params = {
		namespace,
		name: props.secret ? props.secret : name
	};
	loading2.value = true;
	getSecretsData(params)
		.then((res) => {
			secretsData.value = ObjectMapper.secrets(res.data);
		})
		.finally(() => {
			loading2.value = false;
		});
};

const secretValueVisibleHandler = () => {
	secretValueVisible.value = !secretValueVisible.value;
};

watch(
	() => route.params.name,
	async (newId) => {
		fetchSecretsData();
	},
	{
		immediate: true
	}
);
</script>
<style lang="scss" scoped>
::v-deep(.service-desc-wrapper a) {
	color: $blue-default;
}
</style>
