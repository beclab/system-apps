/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js

/* eslint-disable @typescript-eslint/no-var-requires */

const { configure } = require('quasar/wrappers');
require('dotenv').config({ path: '../../.env' });
const path = require('path');
const proxyTarget = 'control-hub.yangyongheng.myterminus.com';
module.exports = configure(function (ctx) {
	return {
		// https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
		supportTS: {
			tsCheckerConfig: {
				eslint: {
					enabled: true,
					files: './src/**/*.{ts,tsx,js,jsx,vue}'
				}
			}
		},

		// https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
		preFetch: true,

		// app boot file (/src/boot)
		// --> boot files are part of "main.js"
		// https://v2.quasar.dev/quasar-cli-webpack/boot-files
		boot: ['i18n', 'axios', 'element-plus', 'bytetrade-ui'],

		// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-css
		css: ['app.scss', ctx.dev ? '' : 'font.pro.scss'],

		// https://github.com/quasarframework/quasar/tree/dev/extras
		extras: [
			'material-symbols-rounded',
		],

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-build
		build: {
			uglifyOptions: {
				compress: { drop_console: true }
			},
			vueRouterMode: 'history', // available values: 'hash', 'history'
			// target: {
			//   browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
			//   node: 'node16'
			// },
			// transpile: false,
			// publicPath: '/',
			env: {
				URL: process.env.URL,
				LOGIN_USERNAME: process.env.LOGIN_USERNAME,
				LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
				AUTH_TOKEN: process.env.AUTH_TOKEN,
				ACCOUNT: process.env.ACCOUNT
			},

			// Add dependencies for transpiling with Babel (Array of string/regex)
			// (from node_modules, which are by default not transpiled).
			// Applies only if "transpile" is set to true.
			// transpileDependencies: [],

			// rtl: true, // https://quasar.dev/options/rtl-support
			// preloadChunks: true,
			// showProgress: false,
			// gzip: true,
			analyze: false,
			chainWebpack(config) {
				config.resolve.symlinks(false);
				config.resolve.alias.set('vue', path.resolve('./node_modules/vue'));
			}

			// Options below are automatically set depending on the env, set them if you want to override
			// extractCSS: false,

			// https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			// chainWebpack (/* chain */) {}
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-devServer
		devServer: {
			https: true,
			open: true, // opens browser window automatically,
			proxy: {
				'/kapis/terminal': {
					target: `wss://${proxyTarget}`,
					changeOrigin: true,
					ws: true,
					http: false
				},
				'/apis/apps/v1/watch': {
					target: `wss://${proxyTarget}`,
					changeOrigin: true,
					ws: true,
					http: false
				},
				'/api/v1/watch': {
					target: `wss://${proxyTarget}`,
					changeOrigin: true,
					ws: true,
					http: false
				},
				'/kapis': {
					target: `https://${proxyTarget}`,
					changeOrigin: true,
					secure: false,
					ws: false
				},
				'/api': {
					target: `https://${proxyTarget}`,
					changeOrigin: true,
					secure: false
				},
				'/bfl': {
					target: `https://${proxyTarget}`,
					changeOrigin: true,
					secure: false
				},
				'/capi': {
					target: `https://${proxyTarget}`,
					changeOrigin: true,
					secure: false
				},
				'/middleware': {
					target: `https://${proxyTarget}`,
					changeOrigin: true,
					secure: false
				},
				'/zinc_search': {
					target: `https://${proxyTarget}`,
					changeOrigin: true,
					secure: false
				}
			},
			port: 8080
		},

		// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-framework
		framework: {
			config: {},

			iconSet: 'material-symbols-rounded', // Quasar icon set
			// lang: 'en-US', // Quasar language pack

			// For special cases outside of where the auto-import strategy can have an impact
			// (like functional components as one of the examples),
			// you can manually specify Quasar components/directives to be available everywhere:
			//
			// components: [],
			// directives: [],

			// Quasar plugins
			plugins: ['Dialog', 'Notify', 'Loading', 'Cookies', 'AppFullscreen']
		},

		animations: 'all', // --- includes all animations
		// https://quasar.dev/options/animations
		// animations: [],

		// https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/configuring-ssr
		ssr: {
			pwa: false,

			// manualStoreHydration: true,
			// manualPostHydrationTrigger: true,

			prodPort: 3000, // The default port that the production server should use
			// (gets superseded if process.env.PORT is specified at runtime)

			maxAge: 1000 * 60 * 60 * 24 * 30,
			// Tell browser when a file from the server should expire from cache (in ms)

			// chainWebpackWebserver (/* chain */) {},

			middlewares: [
				ctx.prod ? 'compression' : '',
				'render' // keep this as last one
			]
		},

		// https://v2.quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa
		pwa: {
			workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
			workboxOptions: {}, // only for GenerateSW

			// for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
			// if using workbox in InjectManifest mode
			// chainWebpackCustomSW (/* chain */) {},

			manifest: {
				name: 'Control Hub',
				short_name: 'Control Hub',
				description: '',
				display: 'standalone',
				orientation: 'portrait',
				background_color: '#ffffff',
				theme_color: '#027be3',
				icons: [
					{
						src: 'icons/icon-128x128.png',
						sizes: '128x128',
						type: 'image/png'
					},
					{
						src: 'icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icons/icon-256x256.png',
						sizes: '256x256',
						type: 'image/png'
					},
					{
						src: 'icons/icon-384x384.png',
						sizes: '384x384',
						type: 'image/png'
					},
					{
						src: 'icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-cordova-apps/configuring-cordova
		cordova: {
			// noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
		capacitor: {
			hideSplashscreen: true
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
		electron: {
			bundler: 'packager', // 'packager' or 'builder'

			packager: {
				// https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
				// OS X / Mac App Store
				// appBundleId: '',
				// appCategoryType: '',
				// osxSign: '',
				// protocol: 'myapp://path',
				// Windows only
				// win32metadata: { ... }
			},

			builder: {
				// https://www.electron.build/configuration/configuration

				appId: 'settings'
			},

			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			chainWebpackMain(/* chain */) {
				// do something with the Electron main process Webpack cfg
				// extendWebpackMain also available besides this chainWebpackMain
			},

			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			chainWebpackPreload(/* chain */) {
				// do something with the Electron main process Webpack cfg
				// extendWebpackPreload also available besides this chainWebpackPreload
			}
		}
	};
});
