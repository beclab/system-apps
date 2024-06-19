<template>
	<MyContentPage>
		<template #extra>
			<div class="col-auto">
				<MoreSelection :options="options" size="md"></MoreSelection>
			</div>
		</template>
		<EnvironmentVariables>
			<DetailData ref="detaiDatalRef"></DetailData>
		</EnvironmentVariables>
		<Yaml ref="yamlRef" :name="t('EDIT_YAML')" @change="fetchList"></Yaml>
	</MyContentPage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from 'src/boot/i18n';
import EnvironmentVariables from 'src/containers/EnvironmentVariables.vue';
import Yaml from 'src/pages/NamespacePods/Yaml.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import DetailData from './DetailData.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';

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

const fetchList = () => {
	detaiDatalRef.value && detaiDatalRef.value.update();
};
</script>
