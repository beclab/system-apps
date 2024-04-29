<template>
	<div class="column items-center absolute-center">
		<q-img :src="empty3Icon" :ratio="1" width="160px" />
		<div class="text-body3 text-grey-8 q-mb-lg">No Matching Result Found</div>
		<QButtonStyle>
			<q-btn dense outline no-caps @click="clickHandler">
				<div class="q-px-sm">
					<q-icon name="sym_r_refresh" color="grey-8" size="20px" />
					<span class="text-body2 q-ml-xs text-grey-8">Refresh Data</span>
				</div>
			</q-btn>
		</QButtonStyle>
	</div>
</template>

<script setup lang="ts">
import empty3Icon from '../assets/empty3.svg';
import QButtonStyle from './QButtonStyle.vue';

const emits = defineEmits(['click']);

const clickHandler = () => {
	emits('click');
};
</script>

<style></style>
