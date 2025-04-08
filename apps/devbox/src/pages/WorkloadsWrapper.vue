<template>
	<Workloads :refreshList="status"></Workloads>
</template>

<script setup lang="ts">
import { useDockerStore } from '@/stores/docker';
import { APP_INSTALL_STATE } from '@/types/core';
import Workloads from 'src/pages/ApplicationSpaces/Workloads/Workloads.vue';
import { computed, watch } from 'vue';
const dockerStore = useDockerStore();

const status = computed(
	() => dockerStore.appInstallState === APP_INSTALL_STATE.COMPLETED
);
</script>

<style></style>
