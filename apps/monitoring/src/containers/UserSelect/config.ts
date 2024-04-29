import { ref } from 'vue';

export const initOptions = [
	{
		label: 'All',
		value: ''
	}
];
export const options = ref(initOptions);

export const selectValue = ref(options.value[0]);
