import { boot } from 'quasar/wrappers';
import { useAppDetailStore } from 'src/stores/AppDetail';

export default boot(({ app }) => {
	app.directive('permission', (el, binding, vnode) => {
		const appDetailStore = useAppDetailStore();
		if (!appDetailStore.hasPermission(binding.value)) {
			vnode.el.remove();
		}

		appDetailStore.$subscribe(() => {
			if (!appDetailStore.hasPermission(binding.value)) {
				vnode.el.remove();
			}
		});
	});
});
