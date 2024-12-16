/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

const http = require('http');
const zlib = require('zlib');
const querystring = require('querystring');

const { getServerConfig } = require('./libs/utils');
const { checkUrl, canModify, isAdmin } = require('./cache/user');

const { server: serverConfig } = getServerConfig();

const NEED_OMIT_HEADERS = ['referer'];

const k8sResourceProxy = {
	target: serverConfig.apiServer.url,
	changeOrigin: true,
	events: {
		proxyReq(proxyReq, req, res, options) {
			const parsedUrl = new URL(req.url, 'http://locathost:3000');
			const { pathname, search } = parsedUrl;
			const target = checkUrl(pathname);
			if (target) {
				if (canModify(req, pathname)) {
					options.selfHandleResponse = true;
				}
				if (!isAdmin(req) && target.searchParamsFn) {
					const newParams = {
						...querystring.parse(parsedUrl.search.slice(1)),
						...target.searchParamsFn(
							req,
							querystring.parse(parsedUrl.search.slice(1))
						)
					};
					const modifiedUrl = `${pathname}?${querystring.stringify(newParams)}`;
					proxyReq.path = modifiedUrl;
				}
			}
			if (req.token) {
				proxyReq.setHeader('Authorization', `Bearer ${req.token}`);
			}

			NEED_OMIT_HEADERS.forEach((key) => proxyReq.removeHeader(key));
		},
		proxyRes: k8sResourceproxyRes
	}
};

const b2iFileProxy = {
	target: serverConfig.apiServer.url,
	changeOrigin: true,
	ignorePath: true,
	selfHandleResponse: true,
	optionsHandle(options, req) {
		options.target += `/${req.url.slice(14)}`;
	},
	events: {
		proxyReq(proxyReq, req) {
			proxyReq.setHeader('Authorization', `Bearer ${req.token}`);

			NEED_OMIT_HEADERS.forEach((key) => proxyReq.removeHeader(key));
		},
		proxyRes(proxyRes, req, client_res) {
			let body = [];
			proxyRes.on('data', (chunk) => {
				body.push(chunk);
			});
			proxyRes.on('end', () => {
				const redirectUrl = proxyRes.headers.location;
				if (!redirectUrl) {
					body = Buffer.concat(body).toString();
					client_res.writeHead(500, proxyRes.headers);
					client_res.end(body);
					console.error(`get b2i file failed, message: ${body}`);
				}
				const proxy = http.get(proxyRes.headers.location, (res) => {
					client_res.writeHead(res.statusCode, res.headers);
					res.pipe(client_res, { end: true });
				});
				client_res.pipe(proxy, { end: true });
			});
		}
	}
};

function modifyResponseBody(req, data, pathname) {
	const target = checkUrl(pathname);
	return target.resFormat(req, data);
}

function k8sResourceproxyRes(proxyRes, req, res) {
	console.log('k8sResourceproxyRes', req.headers['x-bfl-user']);
	const contentEncoding = proxyRes.headers['content-encoding'];
	const headers = proxyRes.headers;
	let { pathname } = new URL(req.url, 'http://locathost:3000');

	if (canModify(req, pathname)) {
		if (contentEncoding === 'gzip') {
			const gunzip = zlib.createGunzip();
			let rawData = '';
			gunzip.on('data', (chunk) => {
				rawData += chunk;
			});
			res.writeHead(proxyRes.statusCode, headers);

			gunzip.on('end', () => {
				try {
					const originalData = modifyResponseBody(
						req,
						JSON.parse(rawData),
						pathname
					);
					const modifiedData = JSON.stringify(originalData);
					const compressedData = zlib.gzipSync(modifiedData);
					res.write(compressedData);
					res.end();
				} catch (error) {
					console.error(error);
					// ctx.throw(500, 'Internal Server Error');
				}
			});

			proxyRes.pipe(gunzip);
		} else {
			let rawData = '';
			proxyRes.on('data', (chunk) => {
				rawData += chunk;
			});
			res.writeHead(proxyRes.statusCode, proxyRes.headers);
			proxyRes.on('end', () => {
				try {
					const originalData = modifyResponseBody(
						req,
						JSON.parse(rawData),
						pathname
					);
					const modifiedData = JSON.stringify(originalData);
					res.write(modifiedData);
					res.end();
				} catch (error) {
					console.error(error);
					// ctx.throw(500, 'Internal Server Error');
				}
			});

			// proxyRes.pipe(res);
		}
	}
}

module.exports = {
	k8sResourceProxy,
	b2iFileProxy
};
