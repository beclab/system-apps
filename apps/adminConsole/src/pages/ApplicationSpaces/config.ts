import userSpace from 'src/assets/user-space.svg';
import osSystem from 'src/assets/os-system.svg';
import userSystem from 'src/assets/user-system.svg';
import defaultIcon from 'src/assets/default.svg';
import gpuIcon from 'src/assets/gpu.svg';
import { useAppDetailStore } from 'src/stores/AppDetail';
import kubeIcon from 'src/assets/kube.png';
import kubesphereIcon from 'src/assets/kubesphere.png';
import { useAppList } from 'src/stores/AppList';
import { get } from 'lodash';

const appList = useAppList();
const USERSPACE = 'user-space';
const USERSYSTEM = 'user-system';
const appDetail = useAppDetailStore();
let username: undefined | string = '';
let icons: Record<string, string> = {};

export const placeholderIcon = defaultIcon;

export const customNamesapceIcon: any = (username: string) => ({
	[`user-system-${username}`]: userSystem,
	[`user-space-${username}`]: userSpace
});
export const namespaceIcon: any = (username: string) => ({
	[`user-system-${username}`]: userSystem,
	[`user-space-${username}`]: userSpace,
	'os-system': osSystem,
	default: userSpace,
	'kubekey-system': kubesphereIcon,
	'kubesphere-monitoring-federated': kubesphereIcon,
	'kubesphere-controls-system': kubesphereIcon,
	'kubesphere-system': kubesphereIcon,
	'kubesphere-monitoring-system': kubesphereIcon,
	'kube-system': kubeIcon,
	'kube-public': kubeIcon,
	'kube-node-lease': kubeIcon,
	'gpu-system': gpuIcon
});

export const getNamespaceIcon = (namespace: string, user?: string) => {
	username = appDetail.data?.user.username;
	const app = namespace.substring(0, namespace.lastIndexOf('-'));
	icons = { ...customNamesapceIcon(username), ...namespaceIcon(username) };
	const apps = get(appList, `data.${user}`, []);
	const appTarget = apps.find((item) => item.namespace === namespace);
	return namespace.includes(USERSPACE)
		? userSpace
		: namespace.includes(USERSYSTEM)
		? userSystem
		: appTarget
		? appTarget.icon
		: icons[namespace]
		? icons[namespace]
		: icons[app]
		? icons[app]
		: defaultIcon;
};
