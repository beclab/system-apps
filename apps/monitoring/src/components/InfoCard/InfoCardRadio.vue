<template>
	<div class="row q-col-gutter-xl">
		<div
			v-for="(item, index) in list"
			:key="item.name"
			class="col-sm-6 col-md-6 col-lg-3 col-xl-3"
		>
			<InfoCardItem
				:active="index === active"
				@click="itemClick(index, item)"
				:used="item.used"
				:total="item.total"
				:name="item.name"
				:unit-type="item.unitType"
				:img="item.img"
				:img_active="item.img_active"
				:loading="loading"
			></InfoCardItem>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, toRef, toRefs } from 'vue';
import InfoCardItem from './InfoCardItem.vue';
import { InfoCardItemProps } from './InfoCardItem.vue';

export interface InfoCardRadioProps {
	list?: Array<InfoCardItemProps>;
	defaultActive?: number;
	loading?: boolean;
}

const emit = defineEmits<{
	(e: 'change', data: InfoCardItemProps, index: number): void;
}>();

const props = withDefaults(defineProps<InfoCardRadioProps>(), {
	defaultActive: 0
});

const active = ref(props.defaultActive);
const itemClick = (index: number, data: InfoCardItemProps) => {
	active.value = index;
	emit('change', data, index);
};
</script>

<style></style>
