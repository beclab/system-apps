import { boot } from 'quasar/wrappers';
import BtUI from '@bytetrade/ui';
import { BtDialog } from '@bytetrade/ui';
import { Dialog } from 'quasar';

export default boot(({ app }) => {
	BtDialog.init(Dialog);
	app.use(BtUI);
});
