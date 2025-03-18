<template>
	<q-card class="image-container" flat>
		<q-card-section class="text-h6 text-ink-1"> 镜像与启动命令 </q-card-section>

		<q-card-section class="q-py-none">
			<card-form-item name="容器镜像" :required="true" tip="启动命令">
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="imageConfig.imageName"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.imageName.placeholder"
					:rules="ruleConfig.imageName.rules"
				>
				</q-input>
			</card-form-item>

			<card-form-item name="启动命令" :required="true" tip="启动命令">
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="imageConfig.startCommand"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.startCommand.placeholder"
					:rules="ruleConfig.startCommand.rules"
				>
				</q-input>
			</card-form-item>

			<card-form-item name="命令参数" :required="true" tip="命令参数">
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="imageConfig.startCommand"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.startCommand.placeholder"
					:rules="ruleConfig.startCommand.rules"
				>
				</q-input>
			</card-form-item>

			<card-form-item name="容器端口" :required="true" tip="容器端口">
				<q-input
					dense
					borderless
					no-error-icon
					v-model="imageConfig.websitePort"
					lazy-rules
					class="form-item-input"
					input-class="text-ink-2"
					:rules="ruleConfig.websitePort.rules"
					:placeholder="ruleConfig.websitePort.rules"
				>
				</q-input>
			</card-form-item>
		</q-card-section>
	</q-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ruleConfig } from './../../types/config';
import CardFormItem from './../common/CardFormItem.vue';

const imageConfig = reactive({
	imageName: '',
	startCommand: '',
	websitePort: '8080'
});
</script>

<style lang="scss" scoped>
.image-container {
	margin: 20px 20px 0 20px;
	padding: 4px;
	border-radius: 12px;
	background-color: $background-1;
}
</style>
