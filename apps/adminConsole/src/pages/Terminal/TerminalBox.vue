<template>
	<div
		class="relative-position bg-background-6"
		:style="{
			height: terminalStore.terminal_show ? '100vh' : '0px'
		}"
		v-if="terminalStore.terminal_init"
	>
		<div class="node-terminal-content">
			<Terminal
				class="node-terminal-wrapper"
				ref="terminalRef"
				flat
				:node="node"
				:visible="terminalStore.terminal_show"
			></Terminal>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Terminal from '@packages/ui/src/containers/TerminalNode.vue';
import { useTerminalStore } from 'src/stores/TerminalStore';
const terminalStore = useTerminalStore();
const terminalRef = ref();
const route = useRoute();
const node = computed(() => route.params.node as string);
</script>

<style lang="scss" scoped>
.node-terminal-content {
	position: absolute;
	inset: 0;
}
.node-terminal-wrapper {
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>
