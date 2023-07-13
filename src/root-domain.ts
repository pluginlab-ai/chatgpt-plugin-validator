import { parse } from "tldts";

export const getRootDomain = (manifestDomain: string): string => {
	const { domain, hostname, subdomain, publicSuffix } = parse(manifestDomain);

	if (!domain) {
		throw new Error('Could not parse domain');
	}

	if (!publicSuffix) {
		throw new Error('Could not parse public suffix');
	}

	if (!hostname) {
		throw new Error('Could not parse hostname');
	}

	if (subdomain === 'www') {
		return domain;
	}

	return hostname;
};
