import { colors } from 'quasar';
import { useColor } from '@bytetrade/ui';

const { getPaletteColor } = colors;
const { color: color1 } = useColor('light-blue-default');
const { color: color2 } = useColor('green-default');

export const theme = {
	color: [
		color1.value,
		color2.value,
		getPaletteColor('warning'),
		'#29CC5F',
		'#F73',
		'#8960FF',
		'#67D1FF',
		'#FA8F31',
		'#ca8622',
		'#bda29a',
		'#6e7074',
		'#546570',
		'#c4ccd3'
	]
};
