<template>
	<QTableStyle>
		<q-table
			:rows="ports"
			flat
			:columns="columns"
			row-key="name"
			hide-pagination
			v-ripple="false"
			v-model:pagination="pagination"
		>
			<template v-slot:no-data>
				<div class="row justify-center full-width q-mt-lg">
					<Empty></Empty>
				</div>
			</template>
		</q-table>
	</QTableStyle>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Empty from '../components/Empty.vue';
import QTableStyle from '../components/QTableStyle.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
interface Props {
	ports: any[];
}

withDefaults(defineProps<Props>(), {});
const pagination = ref({
	rowsNumber: 0
});
const columns: any = computed(() => [
	{
		label: t('NAME'),
		name: 'name',
		field: 'name',
		align: 'center'
	},
	{
		label: t('PROTOCOL'),
		name: 'protocol',
		field: 'protocol',
		align: 'center'
	},
	{
		label: t('PORT'),
		name: 'containerPort',
		field: 'containerPort',
		align: 'center'
	}
]);
</script>

<style scoped lang="scss"></style>
