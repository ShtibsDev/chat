import os from 'os';

export default function getLocalIp() {
	const networkInterfaces = os.networkInterfaces();

	if (!networkInterfaces['en0'] || !networkInterfaces['en0'][0]) throw new Error('Could not find ip address');
	return networkInterfaces['en0'][0].address;
}
