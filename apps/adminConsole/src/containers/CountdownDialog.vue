<template>
	<q-dialog v-model="showDialog" persistent>
		<q-card style="min-width: 200px">
			<q-card-section>
				<p class="text-h6">{{ title }}</p>
				<p v-html="content"></p>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn
					no-caps
					dense
					:label="t('REPLICAS_SCALE_NOTIFY_CANCEL')"
					@click="closeDialog"
				/>
				<q-btn
					color="primary"
					no-caps
					dense
					:label="t('REPLICAS_SCALE_NOTIFY_CONFIRM', { seconds: countdown })"
					@click="confirm"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue';
import { t } from 'src/boot/i18n';

interface DialogData {
	title: string;
	content: string;
	count: number;
}

const props = withDefaults(defineProps<DialogData>(), {});
const emits = defineEmits(['close', 'confirm']);

const showDialog = ref(true);
const countdown = ref(0);

const { title, content } = toRefs(props);

const closeDialog = () => {
	showDialog.value = false;
	emits('close');
};

const init = () => {
	if (countdown.value === 0) {
		countdown.value = props.count;
		const countdownInterval = setInterval(() => {
			countdown.value--;
			if (countdown.value === 0) {
				clearInterval(countdownInterval);
				confirm();
			}
		}, 1000);
	}
};

const confirm = () => {
	emits('confirm');
	closeDialog();
};

onMounted(() => {
	init();
});
</script>
