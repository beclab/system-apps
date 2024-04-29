export const defaultScrollAreaThumbStyle = {
	right: '2px',
	borderRadius: '12px',
	backgroundColor: 'rgba(24, 33, 79, 0.2)',
	width: '6px'
};

export const hideScrollAreaBottomThumbStyle = {
	bottom: '2px',
	backgroundColor: 'transparent'
};

export enum BackgroundMode {
	desktop = 'Desktop',
	login = 'Login'
}

export const imgContentModes: 'fill'[] =
	// | 'contain' | 'cover' | 'none' | 'scale-down'
	[
		'fill'
		// 'contain',
		// 'cover',
		// 'none',
		// 'scale-down'
	];

export const firstToUpper = (str: string) => {
	if (str.length === 0) {
		return str;
	}
	return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
};

export const firstToUpperWith_ = (title: string) => {
	return title
		.split('_')
		.map((item) => firstToUpper(item))
		.join(' ');
};
