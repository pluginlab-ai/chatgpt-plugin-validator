import { ParseResultType, parseDomain } from 'parse-domain';
import { ValueOrError } from 'src/interfaces/common.types';

export const getRootDomain = (manifestDomain: string): ValueOrError<string> => {
  const rootDomainParseResult = parseDomain(manifestDomain);

  if (rootDomainParseResult.type !== ParseResultType.Listed) {
    const error = new Error(
      `The root domain must be a listed domain. Received: ${manifestDomain}`,
    );

    return [null, error];
  }

  const {
    domain: rootDomain,
    subDomains,
    topLevelDomains,
  } = rootDomainParseResult;

  if (subDomains.length === 1 && subDomains[0] === 'www') {
    const shortenedRootDomain = `${rootDomain}.${topLevelDomains.join('.')}`;

    return [shortenedRootDomain, null];
  }

  return [manifestDomain, null];
};
