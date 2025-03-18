<template>
	<q-card-actions class="row justify-end items-center" style="padding: 0">
		<q-btn
			v-if="showCancel"
			clickable
			dense
			no-caps
			flat
			type="reset"
			class="but-cancel row justify-center items-center"
			@click="cancel"
		>
			{{ cancelText }}
		</q-btn>

		<q-btn
			clickable
			dense
			no-caps
			flat
			type="submit"
			class="but-create row justify-center items-center"
			@click="submit"
		>
			{{ okText }}
		</q-btn>
	</q-card-actions>
</template>

<script lang="ts" setup>
defineProps({
	okText: {
		type: String,
		default: 'Submit',
		required: false
	},
	cancelText: {
		type: String,
		default: 'Cancel',
		required: false
	},
	showCancel: {
		type: Boolean,
		default: true,
		required: false
	}
});

const emits = defineEmits(['submit', 'cancel']);

const submit = () => {
	emits('submit');
};

const cancel = () => {
	emits('cancel');
};
</script>

<style scoped lang="scss">
.but-create {
	min-width: 100px !important;
	height: 40px;
	border-radius: 8px;
	font-weight: 500;
	background: rgba(0, 190, 158, 1);
	color: #ffffff;
	font-size: 16px;
	margin-left: 12px !important;
}
.but-cancel {
	min-width: 100px !important;
	height: 40px;
	border-radius: 8px;
	font-weight: 500;
	font-size: 12px;
	border: 1px solid $separator;
	color: $ink-2;
	font-size: 16px;
}
</style>
