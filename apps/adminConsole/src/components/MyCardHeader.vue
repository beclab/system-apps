<template>
	<div class="row items-center">
		<div style="width: 20px; height: 20px" v-if="isStudio">
			<q-img
				v-if="img"
				:src="img"
				:ratio="1"
				width="20px"
				spinner-size="8px"
				:placeholder-src="defaultIcon"
				style="width: 20px; height: 20px; border-radius: 50%"
			/>
		</div>
		<div class="q-ml-sm ellipsis" style="cursor: text">
			<MyTitle size="sm" style="flex: 1">
				<slot name="title"></slot>
				<template v-if="title">
					{{ title }}
				</template>
			</MyTitle>
		</div>
	</div>
</template>

<script setup lang="ts">
import MyTitle from '@packages/ui/src/components/MyListItem/MyTitle.vue';
import defaultIcon from 'src/assets/default.svg';
import { useIsStudio } from 'src/stores/hook';
import { toRefs, useSlots } from 'vue';
const isStudio = useIsStudio();
interface Props {
	title?: string;
	img?: string;
}

const slots = useSlots();

const props = withDefaults(defineProps<Props>(), {
	title: '',
	img: ''
});

const { title, img } = toRefs(props);
</script>

<style lang="scss" scoped></style>
