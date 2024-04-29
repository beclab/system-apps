<template>
	<div class="text-grey-6" v-if="showing">{{ t('LOADING') }}</div>
</template>

<script setup lang="ts">
import { t } from 'src/boot/i18n';

interface Props {
	showing: boolean;
}

withDefaults(defineProps<Props>(), {});
</script>

<style></style>
