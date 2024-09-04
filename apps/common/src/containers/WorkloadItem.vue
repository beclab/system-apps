<template>
	<div
		class="workload-item-container row items-center q-col-gutter-x-md no-wrap q-pa-lg"
	>
		<div class="col-4 q-pa-none">
			<ListItem size="sm" icon-size="lg">
				<template #avatar>
					<q-img :src="deploymentsIcon" width="32px"> </q-img>
				</template>
				<template #title>
					<!-- <a class="workload-item-link" :href="pathFormat(detail)">
            {{ getDisplayName(detail) }}
          </a> -->

					<router-link class="workload-item-link" :to="pathFormat(detail)">
						{{ getDisplayName(detail) }}
					</router-link>
				</template>
				<template #subTitle>
					<WorkloadsDescription :detail="detail"></WorkloadsDescription>
				</template>
			</ListItem>
		</div>
		<div class="col-4">
			<ListItem size="sm" icon-size="lg">
				<template #title>
					<WorkloadStatus
						:data="detail"
						:module="detail.module"
					></WorkloadStatus>
				</template>
				<template #subTitle>
					{{ t('STATUS') }}
				</template>
			</ListItem>
		</div>
		<div class="col-4">
			<ListItem
				size="sm"
				icon-size="lg"
				:title="`#${currentRevision}`"
				:sub-title="t('REVISION_RECORD')"
				class="relative-position"
				v-if="!loading"
			>
			</ListItem>
		</div>
		<SimpleLoading :showing="loading"> </SimpleLoading>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import { get } from 'lodash';
import { MODULE_KIND_MAP } from 'src/utils/constants';
import { useRoute } from 'vue-router';
import { getRevisions } from 'src/network';
import { ObjectMapper } from 'src/utils/object.mapper';
import { getDisplayName } from 'src/utils';
import WorkloadStatus from './WorkloadStatus.vue';
import WorkloadsDescription from './WorkloadsDescription.vue';
import { getCurrentRevision } from '../utils/workload';
import SimpleLoading from '../components/SimpleLoading.vue';
import deploymentsIcon from 'src/assets/Deployments.svg';
import ListItem from '../components/MyListItem/ListItem.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
interface Props {
	prefix: string;
	detail: any;
}
const route = useRoute();
const props = withDefaults(defineProps<Props>(), {});
const loading = ref(false);
const revisionsData = ref();
const currentRevision = ref();
const kind = computed(() => get(props.detail, 'module'));

const fetchRevisions = () => {
	const { namespace, kind }: Record<string, any> = route.params;
	loading.value = true;
	getRevisions(props.detail.module, props.detail)
		.then((res: any) => {
			const list = res.data.items
				.map(ObjectMapper.revisions)
				.filter(
					(revision: any) =>
						revision.ownerName === props.detail.name &&
						revision.ownerKind === MODULE_KIND_MAP[kind]
				);

			currentRevision.value = getCurrentRevision(
				props.detail,
				list,
				props.detail.module
			);
		})
		.finally(() => {
			loading.value = false;
		});
};

const pathFormat = (data: any) => {
	return `/application-spaces/workloads/${data.module}/${data.namespace}/${data.name}/${data.uid}/${data.createTime}?type=workload`;
};

fetchRevisions();
</script>

<style lang="scss" scoped>
.workload-item-container {
	border: 1px solid $separator;
	border-radius: 8px;
}
.workload-item-link {
	color: $ink-1;
	text-decoration: none;
	&:hover {
		color: $blue-default;
	}
}
</style>
