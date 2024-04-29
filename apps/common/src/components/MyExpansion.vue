<template>
	<div class="row items-center justify-between">
		<ListItemVue :title="label">
			<template #avatar>
				<q-img :src="dockerIcon" />
			</template>
		</ListItemVue>
		<QButtonStyle size="md">
			<q-btn
				color="grey-8"
				flat
				dense
				:icon="expanded ? 'arrow_drop_up' : 'arrow_drop_down'"
				@click="expanded = !expanded"
			/>
		</QButtonStyle>
	</div>

	<q-slide-transition>
		<div :style="{ height: expanded ? 'auto' : 0, overflowY: 'hidden' }">
			<q-separator spaced />
			<slot></slot>
		</div>
	</q-slide-transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QButtonStyle from './QButtonStyle.vue';
import ListItemVue from './MyListItem/ListItem.vue';
import dockerIcon from '../assets/docker.svg';
interface Props {
	label: string;
	expand: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const expanded = ref(false);
</script>

<style></style>
