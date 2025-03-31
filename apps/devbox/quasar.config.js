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
const fs = require('fs');

const PreloadWebpackPlugin = require('preload-webpack-plugin');
const proxyTarget = process.env.PROXY_DOMAIN;
const proxyTargetControlHub = process.env.PROXY_DOMAIN_CONTROL_HUB;
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
		boot: ['monacoplugin', 'markdown', 'axios', 'bytetrade-ui', 'i18n'],

		// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-file#css
		// css: ['app.scss', ctx.dev ? 'font.dev.scss' : 'font.pro.scss'],
		css: ['app.scss'],

		// https://github.com/quasarframework/quasar/tree/dev/extras
		extras: ['material-icons', 'material-symbols-rounded', 'roboto-font'],

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
				UPLOAD: ctx.dev ? '' : 'https://dexbox-upload.snowinning.com'
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

				config.optimization.splitChunks({
					chunks: 'all', // The type of chunk that requires code segmentation
					minSize: 20000, // Minimum split file size
					minRemainingSize: 0, // Minimum remaining file size after segmentation
					minChunks: 1, // The number of times it has been referenced before it is split
					maxAsyncRequests: 30, // Maximum number of asynchronous requests
					maxInitialRequests: 30, // Maximum number of initialization requests
					enforceSizeThreshold: 50000,
					cacheGroups: {
						// Cache Group configuration
						defaultVendors: {
							test: /[\\/]node_modules[\\/]/,
							priority: -10,
							reuseExistingChunk: true
						},
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true // Reuse the chunk that has been split
						}
					}
				});
			},
			extractCSS: true,
			minify: true,

			// Options below are automatically set depending on the env, set them if you want to override
			// extractCSS: false,

			// https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			// chainWebpack (/* chain */) {},
			extendWebpack(cfg) {
				!ctx.dev &&
					cfg.plugins.push(
						new PreloadWebpackPlugin({
							rel: 'preload',
							include: 'allAssets',
							fileWhitelist: [/.+MaterialSymbolsRounded.+/],
							as: 'font'
						})
					);

				cfg.resolve.alias = {
					...cfg.resolve.alias,

					src: path.resolve(
						__dirname,
						'./node_modules/@apps/admin_console/src'
					),
					'@': path.resolve(__dirname, './src')
				};

				const customEntryPath = './.quasar/client-entry-alias.js';
				const qusarEntryPath = './.quasar/client-entry.js';

				changeQuasarFile(qusarEntryPath, customEntryPath, (content) =>
					content.replace('src/css/app.scss', '@/css/app.scss')
				);
				// .replace('src/css/font.dev.scss', '@/css/font.dev.scss')

				const clientEntry = path.resolve(__dirname, customEntryPath);
				cfg.entry.app = clientEntry;
			}
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-devServer
		devServer: {
			https: false,
			open: true, // opens browser window automatically,
			proxy: {
				'/api/command': {
					// target: "http://127.0.0.1:3010/",
					target: `https://fa5bd82b.${proxyTarget}`,
					changeOrigin: true
				},
				'/api/apps': {
					// target: "http://127.0.0.1:3010/",
					target: `https://fa5bd82b.${proxyTarget}`,
					changeOrigin: true
				},
				'/api/app-cfg': {
					// target: "http://127.0.0.1:3010/",
					target: `https://fa5bd82b.${proxyTarget}`,
					changeOrigin: true
				},
				'/api/list-my-containers': {
					// target: "http://127.0.0.1:3010/",
					target: `https://fa5bd82b.${proxyTarget}`,
					changeOrigin: true
				},
				'/api/files': {
					// target: "http://127.0.0.1:3010/",
					target: `https://fa5bd82b.${proxyTarget}`,
					changeOrigin: true
				},
				'/upload': {
					// target: "http://127.0.0.1:3010/",
					target: `https://fa5bd82b.${proxyTarget}`,
					changeOrigin: true
				},
				'/socket.io': {
					target: 'ws://localhost:9000',
					ws: true
				},
				'/kapis/terminal': {
					target: `wss://${proxyTargetControlHub}`,
					changeOrigin: true,
					ws: true,
					http: false
				},
				'/apis/apps/v1/watch': {
					target: `wss://${proxyTargetControlHub}`,
					changeOrigin: true,
					ws: true,
					http: false
				},
				'/api/v1/watch': {
					target: `wss://${proxyTargetControlHub}`,
					changeOrigin: true,
					ws: true,
					http: false
				},
				'/kapis': {
					target: `https://${proxyTargetControlHub}`,
					changeOrigin: true,
					secure: false,
					ws: false
				},
				'/api': {
					target: `https://${proxyTargetControlHub}`,
					changeOrigin: true,
					secure: false
				},
				'/bfl': {
					target: `https://${proxyTargetControlHub}`,
					changeOrigin: true,
					secure: false
				},
				'/capi': {
					target: `https://${proxyTargetControlHub}`,
					changeOrigin: true,
					secure: false
				},
				'/middleware': {
					target: `https://${proxyTargetControlHub}`,
					changeOrigin: true,
					secure: false
				}
			},
			port: 9000
		},

		// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-framework
		framework: {
			config: {},

			// iconSet: '', // Quasar icon set
			// lang: 'en-US', // Quasar language pack

			// For special cases outside of where the auto-import strategy can have an impact
			// (like functional components as one of the examples),
			// you can manually specify Quasar components/directives to be available everywhere:
			//
			// components: [],
			// directives: [],

			// Quasar plugins
			plugins: ['Dialog', 'Notify', 'Loading']
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
			inspectPort: 5858,
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

				appId: 'devbox'
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

function changeQuasarFile(qusarEntryPath, customEntryPath, contentFormat) {
	const copyClentEntryFilePath = path.resolve(__dirname, customEntryPath);

	fs.access(copyClentEntryFilePath, fs.constants.F_OK, (err) => {
		if (err) {
			fs.copyFileSync(
				path.resolve(__dirname, qusarEntryPath),
				copyClentEntryFilePath
			);

			let fileContent = fs.readFileSync(copyClentEntryFilePath, 'utf8');
			fileContent = contentFormat ? contentFormat(fileContent) : fileContent;

			fs.writeFileSync(copyClentEntryFilePath, fileContent, 'utf8');
		}
	});
}
