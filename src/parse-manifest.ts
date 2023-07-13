import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import * as manifestSchema from './assets/manifest.schema.json';
import { Manifest } from './interfaces/manifest.types.js';

const ajv = new Ajv();

addFormats(ajv);

const validateManifest = ajv.compile<Manifest>(manifestSchema);

export const isValidManifest = (
  manifest: Record<string, any>,
): manifest is Manifest => {
	return validateManifest(manifest);
};
