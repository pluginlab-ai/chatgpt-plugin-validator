import { ParseResultType, parseDomain } from 'parse-domain';
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
  const [rootDomain, getRootDomainError] = getRootDomain(manifestDomain);

  if (getRootDomainError) {
    errors.push({
      message: getRootDomainError.message,
      actual: manifestDomain,
      expected: 'A parsable root domain',
    });

    return errors;
  }

  const apiUrl = new URL(manifest.api.url);
  const rootDomainParseResult = parseDomain(rootDomain);

  if (rootDomainParseResult.type !== ParseResultType.Listed) {
    errors.push({
      message: `The root domain must be a listed domain.`,
      actual: rootDomain,
      expected: 'A listed domain',
    });

    return errors;
  }

  if (apiUrl.host !== rootDomain && !apiUrl.host.endsWith(`.${rootDomain}`)) {
    errors.push({
      message: `The URL provided to the OpenAPI spec must be hosted at the same level or a subdomain of the root domain.`,
      actual: apiUrl.host,
      expected: `[*.]${rootDomain}`,
    });
  }

  const legalUrl = new URL(manifest.legal_info_url);
  const legalHostParseResult = parseDomain(legalUrl.host);

  if (legalHostParseResult.type === ParseResultType.Listed) {
    const { domain: sLDomain } = legalHostParseResult;

    if (sLDomain !== rootDomainParseResult.domain) {
      errors.push({
        message:
          'The second-level domain of the URL provided must be the same as the second-level domain of the root domain.',
        actual: legalUrl.host,
        expected: `[*.]${rootDomainParseResult.domain}.(.*)`,
      });
    }
  }

  const contactInfoHostParseResult = parseDomain(
    manifest.contact_email.replace('@', '.'),
  );

  if (contactInfoHostParseResult.type === ParseResultType.Listed) {
    const { domain: sLDomain } = contactInfoHostParseResult;

    if (sLDomain !== rootDomainParseResult.domain) {
      errors.push({
        message:
          'The second-level domain of the contact email provided must be the same as the second-level domain of the root domain.',
        actual: manifest.contact_email,
        expected: `[*.]@${rootDomainParseResult.domain}.(.*)`,
      });
    }
  }

  return errors;
};
