import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import * as manifestSchema from './assets/manifest.schema.json';
import { Manifest } from './interfaces/manifest.types.js';
import { ValueOrError } from 'src/interfaces/common.types.js';

const ajv = new Ajv();

addFormats(ajv);

const validateManifest = ajv.compile<Manifest>(manifestSchema);

export const parseManifest = (
  manifest: Record<string, any>,
): ValueOrError<Manifest> => {
  if (!validateManifest(manifest)) {
    const error = new Error(
      `Manifest is invalid: ${JSON.stringify(validateManifest.errors)}`,
    );

    return [null, error];
  }

  return [manifest, null];
};
