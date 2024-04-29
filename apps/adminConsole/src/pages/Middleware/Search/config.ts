import { Buffer } from 'buffer';

export const base64encoded = (name: string, password: string) =>
	Buffer.from(name + ':' + password).toString('base64');
