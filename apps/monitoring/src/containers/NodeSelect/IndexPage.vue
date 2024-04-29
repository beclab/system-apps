<template>
	<QSectionStyle>
		<q-select
			style="min-width: 200px"
			v-model="selectValue"
			@update:model-value="selectHandler"
			:options="options"
			dense
			outlined
		>
			<template v-slot:option="scope">
				<q-separator v-if="scope.opt.user" />
				<q-item v-bind="scope.itemProps">
					<q-item-section>
						<q-item-label>{{ scope.opt.label }}</q-item-label>
					</q-item-section>
				</q-item>
			</template>
		</q-select>
	</QSectionStyle>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
	getNodesList,
	getPodsList,
	getUserList
} from '@packages/ui/src/network';
import QSectionStyle from '@packages/ui/src/components/QSectionStyle.vue';
import { GLOBAL_ROLE } from '@packages/ui/src/constant/user';
import { initOptions, options, selectValue } from './config';

const emits = defineEmits(['update:model-value']);

const users = ref<any[]>([]);

const getNodes = () => {
	const params = {
		sortBy: 'createTime'
	};
	getNodesList(params).then((res) => {
		users.value = res.data.items;

		if (users.value.length > 0) {
			const userOptions = users.value.map((item) => ({
				label: item.metadata.name,
				value: item.metadata.name,
				type: 'node'
			}));
			options.value = initOptions.concat(userOptions);
		}
	});
};
const selectHandler = () => {
	emits('update:model-value', selectValue.value);
};
onMounted(() => {
	getNodes();
});
</script>

<style></style>
