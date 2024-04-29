<template>
	<MyPage2>
		<MyCard3 title="Persistent Volume Claim">
			<template #extra>
				<div class="row items-center q-gutter-x-md">
					<Refresh></Refresh>
					<QSectionStyle>
						<q-select
							style="min-width: 200px"
							dense
							v-model="selectValue"
							:options="options"
							outlined
						/>
					</QSectionStyle>
					<QInputStyle>
						<q-input
							v-model="name"
							type="search"
							outlined
							debounce="500"
							:placeholder="t('SEARCH')"
							clearable
							style="min-width: 200px"
						/>
					</QInputStyle>
					<q-separator inset vertical />
					<QButtonStyle>
						<q-btn unelevated color="primary" label="Create" no-caps />
					</QButtonStyle>
				</div>
			</template>
		</MyCard3>
	</MyPage2>
</template>

<script setup lang="ts">
import MyCard3 from '@packages/ui/src/components/MyCard3.vue';
import MyPage2 from '@packages/ui/src/containers/MyPage2.vue';
import Refresh from '@packages/ui/src/components/Refresh.vue';
import QSectionStyle from '@packages/ui/src/components/QSectionStyle.vue';
import QInputStyle from '@packages/ui/src/components/QInputStyle.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import { t } from 'boot/i18n';
import { ref } from 'vue';

const options = [{ label: 'test', value: 'test' }];
const selectValue = ref();
const name = ref();
</script>

<style></style>
