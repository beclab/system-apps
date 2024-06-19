const Router = require('koa-router');

const proxy = require('./middlewares/proxy');

const { k8sResourceProxy } = require('./proxy');

const {
	userDetail,
	cacheUser,
	appList,
	monitoringMetric,
	namespaceGroup
} = require('./controllers/view');

const router = new Router();

router
	.get('/capi/app/detail', userDetail)
	.get('/capi/app/myapps', appList)

	.all('/(k)?api(s)?/(.*)', cacheUser)
	.use(proxy('/(k)?api(s)?/(.*)', k8sResourceProxy))
	.all('/(c)?api(s)?/(.*)', cacheUser)
	.get('/capi/monitoring.kubesphere.io/v1alpha3/:type', monitoringMetric)
	.get('/capi/namespaces/group', namespaceGroup)

module.exports = router;
