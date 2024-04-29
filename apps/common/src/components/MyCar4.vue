<template>
	<q-card
		:flat="true"
		:bordered="bordered"
		:dark="dark"
		:tag="tag"
		class="my-card-container rounded-borders-md"
	>
		<q-card-section
			v-if="titleShow"
			class="my-card-section-wrapper q-pa-lg bg-white"
		>
			<div class="row no-wrap justify-between items-center">
				<div class="text-subtitle2 text-grey-10">
					<slot name="title"></slot>
					<template v-if="title">
						{{ title }}
					</template>
				</div>
				<div class="col-auto">
					<slot name="extra" v-if="slots.extra"></slot>
					<template v-if="extra">
						{{ extra }}
					</template>
				</div>
			</div>
		</q-card-section>
		<q-card-section class="q-pa-none q-px-lg q-pb-lg">
			<slot></slot>
		</q-card-section>
	</q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toRefs, useSlots } from 'vue';
import MyTitle from './MyListItem/MyTitle.vue';

interface Props {
	title?: string;
	extra?: string;
	/**
	 * Notify the component that the background is a dark color
	 */
	dark?: boolean | undefined;
	/**
	 * Removes border-radius so borders are squared
	 */
	square?: boolean | undefined;
	/**
	 * Applies a 'flat' design (no default shadow)
	 */
	flat?: boolean | undefined;
	/**
	 * Applies a default border to the component
	 */
	bordered?: boolean | undefined;
	/**
	 * HTML tag to use
	 * Default value: div
	 */
	tag?: string | undefined;
}

const slots = useSlots();

const props = withDefaults(defineProps<Props>(), {
	title: '',
	extra: ''
});

const { title, extra, dark, square, flat, bordered, tag } = toRefs(props);
const titleShow = computed(
	() => title.value || extra || slots.extra || slots.title
);
</script>

<style lang="scss" scoped>
.my-card-container {
	position: relative;
}
</style>
