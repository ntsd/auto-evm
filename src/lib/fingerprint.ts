function getOS() {
	const userAgent = window.navigator.userAgent,
		platform = window.navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		iosPlatforms = ['iPhone', 'iPad', 'iPod'];

	if (macosPlatforms.indexOf(platform) !== -1) {
		return 'Mac OS';
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		return 'iOS';
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		return 'Windows';
	} else if (/Android/.test(userAgent)) {
		return 'Android';
	} else if (/Linux/.test(platform)) {
		return 'Linux';
	}

	return 'unknown';
}

function getBrowserName() {
	if (navigator.userAgent.indexOf('Edge') > -1 && navigator.appVersion.indexOf('Edge') > -1) {
		return 'Edge';
	} else if (
		navigator.userAgent.indexOf('Opera') != -1 ||
		navigator.userAgent.indexOf('OPR') != -1
	) {
		return 'Opera';
	} else if (navigator.userAgent.indexOf('Chrome') != -1) {
		return 'Chrome';
	} else if (navigator.userAgent.indexOf('Safari') != -1) {
		return 'Safari';
	} else if (navigator.userAgent.indexOf('Firefox') != -1) {
		return 'Firefox';
	} else if (navigator.userAgent.indexOf('MSIE') != -1) {
		return 'IE';
	}

	return 'unknown';
}

function getHardwareCPU() {
	return navigator.hardwareConcurrency;
}

export function getFingerprint() {
	return getOS() + getBrowserName() + getHardwareCPU();
}
