<template>
	<MyGridLayout :col-width="colWidth">
		<div
			class="col-6 col-md-4 col-lg-3 my-list-content"
			v-for="item in data"
			:key="item.name"
		>
			<div class="text-body3 q-mb-xs text-ink-3">{{ item.name }}</div>
			<div class="text-body2 text-ink-2">
				<div v-if="item.name === 'Cluster'">
					<span>{{ Cluster }}</span>
				</div>
				<div v-else-if="item.name === $t('STATUS')" class="row items-center">
					<MyBadge :type="item.value" class="q-mr-xs"></MyBadge>
					<span>{{ $t(item.value.toUpperCase()) }}</span>
				</div>
				<div v-else-if="item.name === 'Endpoint'">
					{{ EndpointList(item.value) }}
				</div>
				<div v-else-if="item.name === 'Password'" class="row items-end">
					<slot v-if="$slots.Password" name="Password" :data="item"></slot>
					<div v-else>{{ item.value }}</div>
				</div>
				<div v-else>
					{{ isNil(item.value) || item.value === '' ? '-' : item.value }}
				</div>
			</div>
		</div>
	</MyGridLayout>
</template>

<script setup lang="ts">
import { isArray, isEmpty, isNil } from 'lodash';
import Status from '../components/Status.vue';
import passwordEditIcon from '../assets/password-edit.svg';
import MyGridLayout from '../components/MyGridLayout.vue';
import MyBadge from '../components/MyBadge.vue';

interface Props {
	data:
		| Array<{ name: string; value: string | number; type?: string }>
		| undefined;
	colWidth?: string;
}
const props = withDefaults(defineProps<Props>(), {});

const EndpointList = (value: any) => {
	return isArray(value) ? value.join(' ') : value;
};

const Cluster = 'default';
</script>

<style lang="scss" scoped>
.my-list-content {
	word-break: break-all;
	white-space: pre-wrap;
	font-weight: 500;
	line-height: 16px;
}
</style>
