import { useDevelopingApps } from '../stores/app';
import { ROUTE_NAME } from '../common/router-name';
import { useRoute, useRouter } from 'vue-router';

export async function pushToSystem(route, router, value?: string) {
	const store = useDevelopingApps();

	let namespace: string;
	if (value) {
		namespace = value;
	} else {
		const url = window.location.origin;
		// const url = 'https://studio.zhaohuaiyuan.olares.cn/';
		const olaresId =
			url.split('.')[1] == 'local' ? url.split('.')[2] : url.split('.')[1];
		namespace = store.current_app.appName + '-dev-' + olaresId;
	}

	router.push({
		name: ROUTE_NAME.WORKLOAD,
		params: {
			namespace: namespace,
			id: route.params.id
		}
	});
}
