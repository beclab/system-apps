<template>
	<div
		rounded
		class="my-badge-icon"
		:class="[
			typeFormat === 'failed' ? 'quasar-badge' : '',
			typeFormat,
			`${size}-icon`,
			flicker ? 'flicker' : ''
		]"
	></div>
</template>

<script setup lang="ts">
import _, { lowerCase, lowerFirst } from 'lodash';
import { computed, defineProps } from 'vue';

interface StatusProps {
	type: string;
	size?: 'sm' | 'md' | 'lg';
	flicker?: boolean;
}

const props = withDefaults(defineProps<StatusProps>(), {
	size: 'md'
});

const typeFormat = computed(() => lowerCase(props.type));
</script>

<style lang="scss" scoped>
.my-badge-icon {
	position: relative;
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		border-radius: 50%;
		border: 1px solid #fff;
	}

	&.sm-icon {
		width: 8px;
		height: 8px;
	}
	&.md-icon {
		width: 12px;
		height: 12px;
	}
	&.lg-icon {
		width: 16px;
		height: 16px;
	}

	&.sm-icon::before {
		width: 8px;
		height: 8px;
	}
	&.lg-icon::before {
		width: 12px;
		height: 12px;
	}
	&.lg-icon::before {
		width: 16px;
		height: 16px;
	}

	&.draft,
	&.pending-review,
	&.to-be-reviewed,
	&.creating {
		&::before {
			background-color: $primary;
		}
	}

	&.success,
	&.succeeded,
	&.successful,
	&.ready,
	&.running,
	&.jobrunning,
	&.active,
	&.normal,
	&.bound,
	&.available,
	&.healthy,
	&.ok,
	&.working,
	&.passed,
	&.published {
		&::before {
			background-color: $status-success;
		}
	}

	&.creating,
	&.jobrunning {
		&.flicker {
			animation: flicker 1.5s linear infinite;
		}
	}

	&.updating,
	&.upgrading,
	&.syncing,
	&.building,
	&.notrunning,
	&.warning,
	&.waiting,
	&.terminating,
	&.released,
	&.unfinished,
	&.firing,
	&.major,
	&.deleting,
	&.in-review {
		&.flicker {
			animation: flicker 1.5s linear infinite;
		}

		&::before {
			background-color: $status-warning;
		}
	}

	&.deleting,
	&.deleted,
	&.error,
	&.lost,
	&.unschedulable,
	&.failed,
	&.critical,
	&.rejected {
		&::before {
			background-color: $status-failed;
		}
	}

	&.stopped,
	&.disabled,
	&.pending,
	&.unknown,
	&.draining,
	&.terminated,
	&.completed,
	&.minor,
	&.paused,
	&.inactive,
	&.suspended {
		&::before {
			background-color: $status-pending;
		}
	}
}

@keyframes flicker {
	0% {
		transform: scale(0.7);
		opacity: 0.2;
	}
	50% {
		transform: scale(1.2);
		opacity: 1;
	}
	100% {
		transform: scale(0.7);
		opacity: 0.2;
	}
}
</style>
