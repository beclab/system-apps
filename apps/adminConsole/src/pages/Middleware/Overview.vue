<template>
	<MyPage2>
		<MyCard flat :title="t('DETAILS')">
			<DetailPage :data="details" colWidth="240px">
				<!-- <template v-slot:Password="data">
          <div class="row items-end">
            <span>{{ passworkFormat(data.data.value) }}</span>
            <q-img
              :src="passwordEditIcon"
              fit="cover"
              width="24px"
              @click="passworkHandler(data.data)"
            />
          </div>
        </template> -->
			</DetailPage>
			<Empty v-if="!details.length && !loading"></Empty>
		</MyCard>
		<MyCard no-content-gap flat :title="t('Database')">
			<QTableStyle>
				<q-table
					:rows="database"
					:columns="columns"
					row-key="name"
					flat
					hide-pagination
					v-model:pagination="pagination"
					:rows-per-page-label="$t('RECORDS_PER_PAGE')"
				>
					<template v-slot:body-cell-password="props">
						<q-td :props="props">
							<PasswordToggle
								style="min-width: 164px"
								:value="props.value"
							></PasswordToggle>
						</q-td>
					</template>
					<template v-slot:no-data>
						<div class="row justify-center full-width q-mt-lg">
							<Empty></Empty>
						</div>
					</template>
				</q-table>
			</QTableStyle>
		</MyCard>
	</MyPage2>
	<q-dialog v-model="visible" persistent>
		<q-card style="width: 480px">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">{{ t('CHANGE_PASSWORD') }}</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>
			<q-card-section class="q-mt-md">
				<q-form>
					<q-input
						v-model="user.name"
						type="text"
						outlined
						dense
						disable
						clearable
						:rules="[
							(val) => (val && val.length > 0) || 'Please type something'
						]"
					>
						<template v-slot:before>
							<div class="form-before">Admin</div>
						</template>
					</q-input>
					<q-input
						v-model="user.password"
						:type="isPwd ? 'password' : 'text'"
						outlined
						dense
						clearable
						:rules="[
							(val) => (val && val.length > 0) || t('PASSWORD_EMPTY_DESC'),
							(val) => PATTERN_PASSWORD.test(val) || t('PASSWORD_INVALID_DESC')
						]"
					>
						<template v-slot:before>
							<div class="form-before">Password</div>
						</template>
						<template v-slot:append>
							<q-icon
								:name="isPwd ? 'visibility_off' : 'visibility'"
								class="cursor-pointer"
								@click="isPwd = !isPwd"
							/>
						</template>
					</q-input>
				</q-form>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn :label="t('OK')" type="submit" color="primary" @click="submit" />
			</q-card-actions>
			<q-inner-loading :showing="loading2"> </q-inner-loading>
		</q-card>
	</q-dialog>
	<q-inner-loading :showing="loading"> </q-inner-loading>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import { useAppDetailStore } from 'src/stores/AppDetail';
const appDetailStore = useAppDetailStore();
const username = appDetailStore.user.username;
import {
	getMiddlewareAll,
	getMiddlewareList,
	updateMiddlewarePassword
} from 'src/network';
import { MiddlewareItem } from '@packages/ui/src/network/middleware';
import Empty from '@packages/ui/src/components/Empty.vue';
import Empty2 from '@packages/ui/src/components/Empty2.vue';
import { useQuasar } from 'quasar';
import { PATTERN_PASSWORD } from '@packages/ui/src/utils/constants.js';
import { useRoute } from 'vue-router';
import QTableStyle from '@packages/ui/src/components/QTableStyle.vue';
import MyPage2 from '@packages/ui/src/containers/MyPage2.vue';
import { useI18n } from 'vue-i18n';
import PasswordToggle from '@packages/ui/src/components/PasswordToggle.vue';

const { t } = useI18n();
const route = useRoute();
const $q = useQuasar();
const visible = ref(false);
const user = reactive({
	name: '',
	password: ''
});
const isPwd = ref(true);
const loading = ref(false);
const loading2 = ref(false);
const columns: any = [
	{
		name: 'app',
		required: true,
		label: t('App'),
		align: 'left',
		field: 'app'
	},
	{
		name: 'username',
		align: 'left',
		label: t('DB_USER'),
		field: 'username'
	},
	{ name: 'name', label: t('DATABASE'), field: 'name', align: 'left' },
	{ name: 'password', label: t('PASSWORD'), field: 'password', align: 'left' }
];
const pagination = ref({
	rowsNumber: 0
});
const passworkFormat = (value: string | number) => {
	return '*'.repeat(6);
};

const detailsFormat = (data: MiddlewareItem) => {
	if (!data) return [];
	const { type: middleware, namespace }: Record<string, any> = route.params;
	const postgresqlConfig = [
		{
			name: t('HOST'),
			value: `citus-master-svc.user-system-${username}`
		},
		{
			name: t('USER'),
			value: data.adminUser
		},
		{
			name: t('PASSWORD'),
			value: data.password
		}
	];
	const mongoConfig = [
		{
			name: t('HOST'),
			value: `mongo-cluster-mongos.user-system-${username}`
		},
		{
			name: t('USER'),
			value: data.adminUser
		},
		{
			name: t('PASSWORD'),
			value: data.password
		},
		{
			name: t('MONGOS'),
			value: data.mongos.endpoint
		},
		{
			name: t('SIZE'),
			value: data.mongos.size
		}
	];

	const redisConfig = [
		{
			name: t('HOST'),
			value: `redis-cluster-proxy.user-system-${username}`
		},
		{
			name: t('PASSWORD'),
			value: data.password
		},
		{
			name: t('PROXY'),
			value: data.redisProxy.endpoint
		}
	];

	const normal = [
		{
			name: t('CLUSTER'),
			value: 'default'
		},
		{
			name: t('NAMESPACE'),
			value: data.namespace
		},
		{
			name: t('NODES'),
			value: data.name
		}
	];
	return middleware === 'redis'
		? [...normal, ...redisConfig]
		: middleware === 'mongodb'
		? [...normal, ...mongoConfig]
		: [...normal, ...postgresqlConfig];
};

const details = computed(() => detailsFormat(currentData.value));

const currentData = ref();
const database = computed(() => {
	if (currentData.value && currentData.value.databases) {
		return currentData.value.databases.map((item: any) => ({
			name: item.databases.map((item: any) => item.name),
			username: item.username,
			app: item.name,
			password: item.password
		}));
	} else {
		return [];
	}
});

const submit = () => {
	const { type: middleware, namespace }: Record<string, any> = route.params;
	const params = {
		name: currentData.value.name,
		namespace: currentData.value.namespace,
		middleware: middleware,
		user: currentData.value.username,
		password: user.password
	};
	loading2.value = true;
	updateMiddlewarePassword(middleware, params)
		.then((res) => {
			$q.notify({
				type: 'positive',
				message: res.data.message
			});
			loading2.value = false;
			visible.value = false;
		})
		.catch((err) => {
			$q.notify({
				type: 'negative',
				message: err.message
			});
			loading2.value = false;
		});
};

const fetchData = () => {
	loading.value = true;
	const { type: middleware }: Record<string, any> = route.params;
	Promise.all([getMiddlewareList(middleware), getMiddlewareAll()])
		.then(([middleWareList, databaseList]) => {
			try {
				const target: any = middleWareList?.data?.data[0];
				const databases = databaseList.data.data.filter((child: any) =>
					middleware !== 'redis'
						? child.type === middleware
						: child.type === middleware && child.namespace === target.namespace
				);
				currentData.value = {
					...target,
					databases
				};
			} catch (error) {
				currentData.value = undefined;
			}
		})
		.finally(() => {
			loading.value = false;
		});
};

watch(
	() => route.fullPath,
	() => {
		fetchData();
	},
	{
		immediate: true
	}
);
</script>

<style lang="scss" scoped>
.my-menu-link {
	padding: 8px;
}
.my-menu-link-active {
	background-color: rgba(34, 111, 255, 0.12);
}
.form-before {
	width: 88px;
	font-size: 14px;
	color: #484848;
}
</style>
