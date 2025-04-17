<template>
	<MyGridLayout col-width="168px" gap="lg">
		<div v-for="(item, index) in list" :key="item.name" @click="routeTo(item)">
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
	</MyGridLayout>
</template>

<script setup lang="ts">
import { ref, toRef, toRefs } from 'vue';
import InfoCardItem from './InfoCardItem.vue';
import { InfoCardItemProps } from './InfoCardItem.vue';
import { useRouter } from 'vue-router';
import MyGridLayout from '@packages/ui/src/components/MyGridLayout.vue';
const router = useRouter();
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

const routeTo = (item: InfoCardItemProps) => {
	router.push(item.route);
};
</script>

<style></style>
