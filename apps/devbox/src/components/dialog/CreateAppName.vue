<template>
	<bt-custom-dialog
		ref="CustomRef"
		title="Create a new application"
		:cancel="true"
		:okLoading="loading"
		size="medium"
		:okStyle="{ background: '#00BE9E', color: 'white' }"
		@onSubmit="submit"
	>
		<div class="form-item row">
			<div class="form-item-key text-subtitle2 text-ink-1">
				{{ t('home_appname') }} <span class="text-red-default">*</span>
			</div>
			<div class="form-item-value q-mb-lg">
				<q-input
					ref="appNameRef"
					dense
					borderless
					no-error-icon
					v-model="appName"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="t('home_appname_rules_1')"
					:rules="appNameRules"
				>
				</q-input>
			</div>
		</div>
	</bt-custom-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const appNameRef = ref();
const loading = ref(false);
const appName = ref();

const appNameRules = ref([
	(val) => (val && val.length > 0) || t('home_appname_rules_1'),
	(val) => /^[a-z]/.test(val) || t('home_appname_rules_2'),
	(val) => /^[a-z][a-z0-9]*$/.test(val) || t('home_appname_rules_3')
]);

const submit = () => {
	console.log('click submit');
	if (appNameRef.value.hasError) return;

	// onDialogOK(checkbox.value);
};
</script>

<style lang="scss" scoped>
.form-item {
	.form-item-key {
		width: 100px;
		height: 40px;
		line-height: 40px;
		text-align: center;
	}
	.form-item-value {
		flex: 1;
	}
}
</style>
