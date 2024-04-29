/*
 * @Date: 2023-03-01 15:08:26
 */
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useTokenStore } from '../stores/token';
import { Cookies } from 'quasar';

if (process.env.NODE_ENV === 'development') {
	const auth_token = process.env.AUTH_TOKEN || '';
	Cookies.set('auth_token', auth_token);
}

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$axios: AxiosInstance;
	}
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
	withCredentials: true
});

export default boot(({ app }) => {
	// for use inside Vue files (Options API) through this.$axios and this.$api

	app.config.globalProperties.$axios = axios;
	// ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
	//       so you won't necessarily have to import axios in each vue file

	app.config.globalProperties.$api = api;
	// ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
	//       so you can easily perform requests against your app's API

	app.config.globalProperties.$axios.interceptors.request.use(
		(config: AxiosRequestConfig) => {
			const tokenStore = useTokenStore();
			if (config.headers) {
				config.headers['Access-Control-Allow-Origin'] = '*';
				config.headers['Access-Control-Allow-Headers'] =
					'X-Requested-With,Content-Type';
				config.headers['Access-Control-Allow-Methods'] =
					'PUT,POST,GET,DELETE,OPTIONS';

				if (tokenStore.$state.token?.access_token) {
					config.headers['X-Authorization'] =
						tokenStore.$state.token?.access_token;
					return config;
				} else {
					return config;
				}
			} else {
				return config;
			}
		}
	);

	app.config.globalProperties.$axios.interceptors.response.use(
		(response: AxiosResponse) => {
			if (!response || response.status != 200 || !response.data) {
				throw Error('Network error, please try again later');
			}

			const data = response.data;
			if (data.code == 100001) {
				//store.commit("account/remove");

				// router. push( { path : '/login' });
				throw Error(data.message);
				//return response;
			}

			if (data.code != 0) {
				// if( data.message ) {
				//   Notify.create({
				//       type: 'negative',
				//       message: '' + data.code +' ' + data.message
				//     })
				// }
				//return response;
				throw Error(data.message);
			}

			return data.data;
		}
	);
});

export { api };
