interface MetadataInNodes {
	name: string;
	uid: string;
	resourceVersion: number;
	creationTimestamp: string;
	labels: {
		[key: string]: string;
	};
}

interface Spec {
	containers: Container[];
	dnsPolicy: string;
	enableServiceLinks: true;
	hostname: string;
	nodeName: string;
	preemptionPolicy: string;
	priority: 0;
	restartPolicy: string;
	schedulerName: string;
	securityContext: any;
	serviceAccount: string;
	serviceAccountName: string;
	subdomain: string;
	terminationGracePeriodSeconds: number;
	tolerations: null[];
	volumes: null[];
}

interface Status {
	conditions: null[];
	containerStatuses: null[];
	hostIP: string;
	phase: string;
	podIP: string;
	podIPs: null[];
	qosClass: string;
	startTime: string;
}

export type MetadataInPods = MetadataInNodes & { namespace: string };

export interface Container {
	env: null[];
	image: string;
	imagePullPolicy: string;
	name: string;
	ports: null[];
	resources: any;
	terminationMessagePath: string;
	terminationMessagePolicy: string;
	volumeMounts: null[];
}
export interface PodItem {
	metadata: MetadataInPods;
	spec: Spec;
	status: Status;
}

export type PodItemResponse = PodItem & {
	apiVersion: string;
	kind: string;
};

export interface MonitoringResponseData {
	resultType: string;
	result: {
		avg_value: string;
		currency_unit: string;
		fee: string;
		max_value: string;
		min_value: string;
		resource_unit: string;
		sum_value: string;
		values: [number, string][];
	}[];
}
export interface MonitoringResponse {
	results: {
		metric_name: string;
		data: MonitoringResponseData[];
	}[];
}

export type PodMonitoringParamAll = PodsParam;

export interface PodDetailParam {
	namespace: string;
	podName: string;
}

export interface PodsParam {
	metrics_filter?: string;
	resources_filter?: string;
	start?: string | number;
	end?: string | number;
	step?: string;
	time?: string;
	sort_metric?: string;
	// 'desc' | 'asc'
	sort_type?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	// can not find
	times?: number;
	cluster?: string;
	name?: string;
}

export interface ResourcesResponse {
	items: PodItem[];
	totalItems: number;
}

export type ContainersMonitoringParamAll = PodDetailParam &
	PodsParam & { container: string };

export interface kubesphereStatusItem {
	healthyBackends: number;
	label: { [key: string]: string };
	name: string;
	namespace: string;
	selfLink: string;
	startedAt: string;
	totalBackends: number;
}
export interface ComponenthealthResponse {
	kubesphereStatus: kubesphereStatusItem[];
	nodeStatus: {
		healthyNodes: number;
		totalNodes: number;
	};
}

export type NamespacesResponse = MonitoringResponse & {
	total_item: number;
	total_page: number;
	page: number;
};

export type NamespacesParam = PodsParam & { type: string };
