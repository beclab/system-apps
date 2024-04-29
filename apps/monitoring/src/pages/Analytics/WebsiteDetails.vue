<template>
	<WebsiteDetailsList :websiteId="websiteId"></WebsiteDetailsList>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import WebsiteDetailsList from './WebsiteDetailsList.vue';
import MyDrawer from '@packages/ui/src/components/MyDrawer.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import FullPageWithBack from '@packages/ui/src/components/FullPageWithBack.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { websiteId }: Record<string, any> = route.params;
const { name }: Record<string, any> = route.query;
</script>

<style lang="scss" scoped>
.data-page-wrapper {
	flex: 1;
}
</style>
