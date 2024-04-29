<template>
	<div dense flat class="my-sort-button-icon q-pa-none" @click="statusChange">
		<q-img
			:src="switch_up"
			:ratio="1"
			width="32px"
			:class="[status === 'desc' ? 'desc' : 'asc']"
		/>
	</div>
</template>

<script setup lang="ts">
import switch_up from '@packages/ui/src/assets/switch_down.svg';
import { ref } from 'vue';
interface Props {
	defaultValue: string;
}
const props = withDefaults(defineProps<Props>(), {
	defaultValue: 'desc'
});
const emits = defineEmits(['change']);

const status = ref(props.defaultValue);

const statusChange = () => {
	if (status.value === 'desc') {
		status.value = 'asc';
	} else {
		status.value = 'desc';
	}
	emits('change', status.value);
};
</script>
<style lang="scss" scoped>
.my-sort-button-icon {
	cursor: pointer;
	border: 1px solid $grey-2;
	border-radius: 8px;
	.desc {
		transform: rotateZ(180deg);
	}
}
</style>
