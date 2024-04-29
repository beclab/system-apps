import { ref } from 'vue';

export const initOptions = [
	{
		label: 'All',
		value: '',
		type: 'cluster'
	}
];
export const options = ref(initOptions);

export const selectValue = ref(options.value[0]);
