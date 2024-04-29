<template>
	<q-item
		class="my-menu-link q-py-none q-px-sm rounded-borders"
		active-class="my-menu-link-active text-primary"
		v-bind="$attrs"
	>
		<q-item-section
			v-if="data.img"
			avatar
			style="min-width: 0; padding-right: 8px"
		>
			<div class="avatar-wrapper">
				<div class="relative-position">
					<q-img :src="data.img" width="20px" height="20px" fit="cover" />
					<MyBadge
						v-if="data.status"
						:type="data.status"
						size="sm"
						class="my-badge-wrapper"
					></MyBadge>
				</div>
			</div>
		</q-item-section>

		<q-item-section>
			<q-item-label lines="1">
				<div class="text-body2 text-grey-8 ellipsis">
					<span :class="{ active: data.id === active }">
						{{ data.title }}
					</span>
				</div>
			</q-item-label>
			<q-item-label caption lines="1">
				<div class="text-overline text-grey-5">
					{{ data.subTitle }}
				</div>
			</q-item-label>
		</q-item-section>
	</q-item>
</template>

<script setup lang="ts">
import MyBadge from './MyBadge.vue';

interface Props {
	data: any;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.my-menu-link {
	color: $grey-8;
	min-height: 40px;
}
.my-menu-link-active {
	background-color: rgba(51, 119, 255, 0.1);
	color: $primary;
	.active {
		color: $primary;
	}
}
.avatar-wrapper {
	border: 1px solid rgba(0, 0, 0, 0);
	position: relative;
	.my-badge-wrapper {
		position: absolute;
		bottom: 0;
		right: 0;
	}
}
</style>
