<template>
	<MyContentPage>
		<template #extra>
			<div class="col-auto">
				<MoreSelection :options="options" size="md"></MoreSelection>
			</div>
		</template>
	</MyContentPage>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { t } from 'src/boot/i18n';
import EnvironmentVariables from 'src/containers/EnvironmentVariables.vue';
import Yaml from 'src/pages/NamespacePods/Yaml.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import { getCornJobsDetail } from 'src/network';
import { API_VERSIONS } from 'src/utils/constants';
import { useRoute } from 'vue-router';
const module = 'cronjobs';
const apiVersion = API_VERSIONS[module];

const route = useRoute();
const yamlRef = ref();
const detaiDatalRef = ref();
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

const fetchData = async () => {
	const { namespace, name } = route.params;
	const { data } = await getCornJobsDetail(apiVersion, namespace, module, name);
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
