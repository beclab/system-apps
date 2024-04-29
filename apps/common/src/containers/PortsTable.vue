<template>
	<QTableStyle>
		<q-table
			class="bg-white"
			:rows="ports"
			flat
			:columns="columns"
			row-key="name"
			hide-pagination
			v-ripple="false"
		>
			<template v-slot:no-data>
				<Empty></Empty>
			</template>
		</q-table>
	</QTableStyle>
</template>

<script setup lang="ts">
import { t } from 'src/boot/i18n';
import Empty from '../components/Empty2.vue';
import QTableStyle from '../components/QTableStyle.vue';

interface Props {
	ports: any[];
}

withDefaults(defineProps<Props>(), {});

const columns: any = [
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
];
</script>

<style scoped lang="scss"></style>
