<template>
	<q-card flat bordered class="container-item" style="min-width: 640px">
		<div class="row no-wrap q-pa-sm q-col-gutter-md">
			<div class="col-4">
				<ListItem>
					<template #avatar>
						<q-img :src="dockerIcon" />
						<MyBadge class="my-containers-badge" :type="status"></MyBadge>
					</template>
					<template #title>
						<div class="row items-center no-wrap">
							<div
								:class="[isInit ? 'text-grey-7' : 'container-item-hover']"
								class="ellipsis"
								@click="containerOverviewHandler(container)"
							>
								{{ container.name }}
							</div>
							<q-btn
								v-if="!hideLog"
								color="primary"
								icon="description"
								flat
								dense
								size="sm"
								class="q-mx-xs"
								@click="logsHandler(container)"
							>
								<q-tooltip anchor="top middle" self="bottom middle">{{
									t('CONTAINER_LOGS')
								}}</q-tooltip>
							</q-btn>

							<Terminal
								v-if="status === 'running' && !hideTerminal"
								:data="containerPath(container)"
							>
								<q-tooltip anchor="top middle" self="bottom middle">{{
									t('TERMINAL')
								}}</q-tooltip>
							</Terminal>
						</div>
					</template>
					<template #subTitle>
						<template v-if="reason">
							{{ t(reason) }}
						</template>
						<template v-else>
							{{ t('IMAGE_VALUE', { value: container.image }) }}
						</template>
					</template>
				</ListItem>
			</div>
			<div class="col-8">
				<div class="row no-wrap q-col-gutter-md">
					<div class="col-2">
						<ListItem :bolder="false">
							<template #title>{{ capitalize(status) }}</template>
							<template #subTitle>{{ t('STATUS') }}</template>
						</ListItem>
					</div>
					<div class="col-2">
						<ListItem :bolder="false">
							<template #title>
								{{
									isUndefined(container.restartCount)
										? '-'
										: container.restartCount
								}}
							</template>
							<template #subTitle>
								{{
									!isUndefined(container.restartCount) &&
									container.restartCount === 1
										? t('RESTART')
										: t('RESTART_PL')
								}}
							</template>
						</ListItem>
					</div>
					<div class="col-2 ellipsis">
						<ListItem :bolder="false">
							<template #title> {{ portsFormat(container.ports) }}</template>
							<template #subTitle>
								{{
									!isEmpty(container.ports) && container.ports.length > 1
										? t('PORT_PL')
										: t('PORT')
								}}</template
							>
						</ListItem>
					</div>

					<div v-if="loading" class="col-12 monitoring-empty monitoring-nomal">
						{{ t('LOADING') }}
					</div>
					<div
						v-else-if="!hasData"
						class="col-12 monitoring-empty monitoring-nomal"
					>
						{{ t('NO_MONITORING_DATA') }}
					</div>
					<template v-else>
						<div
							v-for="(item, index) in getMonitoringCfgs"
							:key="index"
							class="col-3"
						>
							<div :class="[index !== 0 ? 'q-ml-md' : '']">
								<MylineChartMini :data="item" />
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</q-card>
	<MyDialog v-model="visible" :title="currentContainer.name">
		<MyPage class="full-height">
			<Logs :container="currentContainer.name" class="full-height"></Logs>
		</MyPage>
	</MyDialog>

	<MyDialog v-model="visible2" :title="currentContainer.name">
		<MyPage style="background-color: rgb(241, 245, 249)">
			<ContainerOverview
				:container="currentContainer.name"
				class="q-mb-md"
			></ContainerOverview>
		</MyPage>
	</MyDialog>
</template>

<script setup lang="ts">
import { t } from 'src/boot/i18n';
import { computed, ref } from 'vue';
import MyBadge from '@packages/ui/src/components/MyBadge.vue';
import dockerIcon from '@packages/ui/src/assets/docker.svg';
import Terminal from '@packages/ui/src/containers/TerminalDialog.vue';
import { useRoute } from 'vue-router';
import MyDialog from '@packages/ui/src/components/MyQDialog.vue';
import Logs from '@packages/ui/src/containers/Logs.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import { isArray, capitalize, isUndefined, isEmpty } from 'lodash-es';
import { getContainerStatus } from '../../utils/status';
import ContainerOverview from '@apps/nodes/src/pages/Containers/Overview.vue';
import MylineChartMini from '@packages/ui/src/components/Charts/MylineChartMini2.vue';
import { getAreaChartOps } from 'src/utils/monitoring';
import ListItem from '@packages/ui/src/components/MyListItem/ListItem.vue';

interface Props {
	metrics: any;
	container: any;
	isInit?: boolean;
	loading: boolean;
	hideTerminal?: boolean;
	hideLog?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	hideTerminal: false,
	hideLog: false
});

const route = useRoute();
const visible = ref(false);
const visible2 = ref(false);
const currentContainer = ref({ name: '' });

const hasData = computed(() => {
	return getMonitoringCfgs.value.some((item) => item.data[0].length > 0);
});

const portsFormat = (ports: { containerPort: string; protocol: string }[]) => {
	if (isArray(ports)) {
		return ports
			.map((port) => `${port.containerPort}/${port.protocol}`)
			.join(', ');
	}
	return '-';
};

const containerPath = (container: any) => {
	const { namespace, name: podName }: Record<string, any> = route.params;

	return {
		namespace,
		podName,
		container: container.name
	};
};

const logsHandler = (item: any) => {
	visible.value = true;
	currentContainer.value = item;
};

const containerOverviewHandler = (item: any) => {
	if (status !== 'terminated') {
		visible2.value = true;
		currentContainer.value = item;
	}
};

const { status, reason } = getContainerStatus(props.container);

const getMonitoringCfgs = computed(() => {
	if (isEmpty(props.metrics)) return [];
	const data = [
		{
			type: 'cpu',
			title: 'CPU',
			unitType: 'cpu',
			legend: ['USED'],
			data: [props.metrics.cpu],
			bgColor: 'transparent'
		},
		{
			type: 'memory',
			title: 'MEMORY',
			unitType: 'memory',
			legend: ['USED'],
			data: [props.metrics.memory],
			bgColor: 'transparent'
		}
	];

	return data.map((item) => getAreaChartOps(item));
});
</script>

<style lang="scss" scoped>
.container-item {
	padding: 16px 12px;
	border-radius: 12px;
}
.my-containers-badge {
	position: absolute;
	left: 20px;
	bottom: 0;
}
.container-item-hover {
	&:hover {
		color: $primary;
		cursor: pointer;
	}
}
.monitoring-empty {
	color: $grey-6;
	font-size: 12px;
}
.monitoring-nomal {
	line-height: 39px;
	vertical-align: bottom;
}
</style>
