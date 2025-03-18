import { boot } from 'quasar/wrappers';
import { BtNotify, NotifyDefinedType } from '@bytetrade/ui';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$axios: AxiosInstance;
	}
}

const api = axios.create({
	withCredentials: true
});

export default boot(({ app }) => {
	app.config.globalProperties.$axios = axios;
	app.config.globalProperties.$api = api;

	app.config.globalProperties.$axios.interceptors.request.use((config) => {
		if (config.headers) {
			config.headers['Access-Control-Allow-Origin'] = '*';
			config.headers['Access-Control-Allow-Headers'] =
				'X-Requested-With,Content-Type';
			config.headers['Access-Control-Allow-Methods'] =
				'PUT,POST,GET,DELETE,OPTIONS';

			return config;
		} else {
			return config;
		}
	});

	app.config.globalProperties.$axios.interceptors.response.use(
		(response: AxiosResponse) => {
			if (!response || response.status != 200 || !response.data) {
				BtNotify.show({
					type: NotifyDefinedType.FAILED,
					message: response.status
				});
				throw Error('Network error, please try again later');
			}

			const res = response.data;
			if (res.code !== 200) {
				BtNotify.show({
					type: NotifyDefinedType.FAILED,
					message: res.message
				});
				throw Error(res.message);
			}

			return res.data;
		}
	);
});

export { api };
