/*
 * @Date: 2023-03-01 15:08:26
 */
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Cookies, Notify } from 'quasar';
try {
	if (process.env.NODE_ENV === 'development') {
		const auth_token = process.env.AUTH_TOKEN || '';
		auth_token && Cookies.set('auth_token', auth_token);
	}
} catch (error) {
	// nothing
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

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const errorResponse = error.response;
		if (errorResponse?.config.method === 'put') {
			Notify.create({
				type: 'negative',
				caption: `${errorResponse.data.reason} ${errorResponse.data.message} `,
				message: errorResponse.data.status
			});
		}

		return Promise.reject(error);
	}
);
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
			return config;
		}
	);
});

export { api };
