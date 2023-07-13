import { parse } from 'tldts';
import { Manifest } from './interfaces/manifest.types';
import { getRootDomain } from './root-domain';

interface DomainConstraintError {
	message: string;
	expected?: string;
	actual?: string;
}

export const validateStaticDomainConstraints = (
	manifestDomain: string,
	manifest: Manifest,
): DomainConstraintError[] => {
	const errors: DomainConstraintError[] = [];
	const rootDomain = getRootDomain(manifestDomain);

	const apiUrl = new URL(manifest.api.url);
	const rootDomainParseResult = parse(rootDomain);

	if (apiUrl.host !== rootDomain && !apiUrl.host.endsWith(`.${rootDomain}`)) {
		errors.push({
			message: `The URL provided to the OpenAPI spec must be hosted at the same level or a subdomain of the root domain.`,
			actual: apiUrl.host,
			expected: `[*.]${rootDomain}`,
		});
	}

	const legalUrl = new URL(manifest.legal_info_url);
	const legalHostParseResult = parse(legalUrl.host);

	const { domain: sLDomain } = legalHostParseResult;

	if (sLDomain !== rootDomainParseResult.domain) {
		errors.push({
			message:
				'The second-level domain of the URL provided must be the same as the second-level domain of the root domain.',
			actual: legalUrl.host,
			expected: `[*.]${rootDomainParseResult.domain}.(.*)`,
		});
	}

	const contactInfoHostParseResult = parse(
		manifest.contact_email.replace('@', '.'),
	);

	const { domain: sLDomain2 } = contactInfoHostParseResult;

	if (sLDomain2 !== rootDomainParseResult.domain) {
		errors.push({
			message:
				'The second-level domain of the contact email provided must be the same as the second-level domain of the root domain.',
			actual: manifest.contact_email,
			expected: `[*.]@${rootDomainParseResult.domain}.(.*)`,
		});
	}

	return errors;
};
