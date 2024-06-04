<template>
	<div
		class="row items-center justify-between my-routebackbar-container"
		:style="{ height: !isContent ? '56px' : 'auto' }"
		:class="[!isContent ? 'q-px-md' : '']"
	>
		<div class="row items-center" @click="routeBack">
			<q-icon
				name="arrow_back_ios_new"
				size="20px"
				class="my-icon"
				v-if="!isContent"
			/>
			<div v-if="$slots.avatar" class="q-mr-sm">
				<slot name="avatar"></slot>
			</div>
			<MyAvatarImg
				v-else-if="avatar"
				:src="avatar"
				:width="!isContent ? '32px' : '48px'"
				:height="!isContent ? '32px' : '48px'"
				:class="!isContent ? 'q-mr-sm' : 'q-mr-lg'"
			></MyAvatarImg>
			<span class="text-ink-1" :class="[!isContent ? 'text-h5' : 'text-h3']">
				{{ title }}
			</span>
		</div>
		<div class="row">
			<slot name="extra"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MyAvatarImg from './MyAvatarImg.vue';

interface Props {
	title?: string;
	subTitle?: string;
	avatar?: string;
	isContent?: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
const { title, subTitle } = toRefs(props);

const router = useRouter();

const routeBack = () => {
	router.back();
};
</script>

<style lang="scss" scoped>
.my-routebackbar-container {
	background: $background-1;
	cursor: default;
	.my-icon {
		padding: 0 6px;
	}
}
.title-img {
	box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
}
</style>
