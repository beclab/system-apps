<template>
	<el-menu-item
		v-if="!item[menuOptions.children] || !item[menuOptions.children].length"
		:index="item[menuOptions.code]"
		:route="item.route ? item.route : null"
	>
		<div class="my-menu-wrapper">
			<slot
				name="menu-item"
				v-if="$slots['menu-item']"
				:data="item"
				:options="menuOptions"
			></slot>
			<div v-else class="row no-wrap">
				<img
					v-if="item[menuOptions.icon]"
					:src="item[menuOptions.icon]"
					alt=""
					class="q-mr-sm"
					style="flex: 0 0 16px"
				/>
				<div class="my-menu-wrapper" style="flex: 1">
					{{ item[menuOptions.title] }}
				</div>
			</div>
		</div>
	</el-menu-item>

	<el-sub-menu v-else :index="item[menuOptions.code]">
		<template #title>
			<img
				v-if="item[menuOptions.icon]"
				:src="item[menuOptions.icon]"
				alt=""
				class="q-mr-sm"
			/>
			<div class="my-menu-wrapper" :id="item.id">
				<slot
					name="menu-item"
					v-if="$slots['menu-item']"
					:data="item"
					:options="menuOptions"
				></slot>
				<span v-else> {{ item[menuOptions.title] }} </span>
			</div>
		</template>
		<infinite-menu-item
			v-for="sub in item[menuOptions.children]"
			:key="sub[menuOptions.code]"
			:item="sub"
			:menu-options="menuOptions"
		/>
	</el-sub-menu>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import InfiniteMenuItem from './MenuItem.vue';

// defineProps({
//   item: {
//     type: Object as any,
//     required: true,
//   },
//   menuOptions: {
//     type: Object as PropType<MenuOptions>,
//     required: true,
//   },
// });
interface Props {
	item: any;
	menuOptions: any;
}
withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="scss">
.my-menu-wrapper {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	::v-deep(.el-sub-menu .el-sub-menu__icon-arrow) {
		display: none;
	}
}
</style>
<style>
/* .el-sub-menu .el-sub-menu__icon-arrow {
  display: none;
}
.el-sub-menu__title {
  padding-right: 20px;
} */
</style>
