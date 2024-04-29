<template>
	<q-btn icon="sym_r_more_vert" flat dense :size="size">
		<q-menu class="my-menu-wrapper">
			<q-list style="min-width: 160px">
				<q-item
					class="q-pa-sm"
					clickable
					v-close-popup
					v-for="item in options"
					:key="item.value"
					@click="clickHandler(item)"
				>
					<q-item-section>
						<div class="row items-center no-wrap text-no-wrap">
							<q-icon
								v-if="item.icon"
								:name="item.icon"
								size="16px"
								class="q-mr-sm"
							/>
							<span class="text-subtitle3 text-grey-8">{{ item.label }}</span>
						</div>
					</q-item-section>
				</q-item>
			</q-list>
		</q-menu>
	</q-btn>
</template>

<script setup lang="ts">
import { isFunction } from 'lodash';
import { toRefs } from 'vue';

interface optionsItem {
	label: string;
	value: string | number;
	icon?: string;
	onClick: (data?: optionsItem) => void;
}
interface Props {
	options: optionsItem[];
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const props = withDefaults(defineProps<Props>(), {
	size: 'sm'
});

const { size } = toRefs(props);

const emits = defineEmits<{
	(event: 'click', data: optionsItem): void;
}>();

const clickHandler = (data: optionsItem) => {
	emits('click', data);
	isFunction(data.onClick) && data.onClick(data);
};
</script>

<style lang="scss">
// .my-menu-wrapper .q-list .q-item .q-focus-helper {
//   border-radius: 4px;
// }
// .my-menu-wrapper .q-item {
//   min-height: 0;
// }
</style>
