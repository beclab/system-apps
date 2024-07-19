<template>
	<q-dialog class="card-dialog" v-model="visible" ref="dialogRef">
		<q-card
			class="card-continer"
			:style="{ width: platform === 'web' ? '400px' : '320px' }"
		>
			<!-- <slot name="dialogBar" />   -->

			<dialog-bar
				:title="title"
				:icon="icon"
				:titAlign="titAlign"
				@close="onCancel"
			/>

			<div class="q-pa-lg">
				<div v-if="prompt">
					<div class="prompt-name q-mb-xs" v-if="prompt.name">
						{{ prompt.name }}
					</div>
					<q-input
						class="prompt-input"
						v-model="promptModel"
						borderless
						input-class="text-ink-2"
						dense
						:placeholder="prompt.placeholder"
					/>
				</div>
				<template v-else>
					{{ message }}
					<q-form @submit="onSubmit" @reset="onReset">
						<slot />
						<dialog-footer
							:ok="ok"
							:cancel="cancel"
							:okStyle="okStyle"
							:loading="okLoading"
							@close="onCancel"
						/>
					</q-form>
				</template>
			</div>

			<!-- <slot name="dialogFooter" />   -->
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { ref, defineProps } from 'vue';

import DialogBar from './DialogBar.vue';
import DialogFooter from './DialogFooter.vue';

const props = defineProps({
	platform: {
		type: String,
		default: 'web',
		required: false
	},
	message: {
		type: String,
		default: '',
		required: false
	},
	title: {
		type: String,
		default: 'Alert',
		required: false
	},
	icon: {
		type: String,
		default: '',
		required: false
	},
	titAlign: {
		type: String,
		default: 'left',
		required: false
	},
	ok: {
		type: [String, Boolean],
		default: true,
		required: false
	},
	okStyle: {
		type: Object as () => any,
		required: false
	},
	cancel: {
		type: [String, Boolean],
		default: false,
		required: false
	},
	okLoading: {
		type: [String, Boolean],
		default: false,
		required: false
	},
	prompt: {
		type: Object as () => any,
		required: false
	},
	submit: Object as () => any,
	reset: Object as () => any
});

const visible = ref(false);

const emits = defineEmits(['submit', 'reset']);
const onSubmit = () => {
	emits('submit');
};

const onReset = () => {
	emits('reset');
};
const show = () => {
	visible.value = true;
};
const close = () => {
	visible.value = false;
};

const onCancel = () => {
	onReset();
	close();
};

defineExpose({
	show,
	close
});
</script>

<style lang="scss" scoped>
.card-dialog {
	.card-continer {
		border-radius: 12px;
		.prompt-name {
			color: $ink-3;
			font-size: 12px;
			line-height: 16px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.prompt-input {
			border: 1px solid $input-stroke;
			border-radius: 8px;
			padding: 0 10px;
		}
	}
}
</style>
