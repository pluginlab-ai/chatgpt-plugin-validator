import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

import * as manifestSchema from './assets/manifest.schema.json';
import { Manifest } from './interfaces/manifest.types.js';

const ajv = new Ajv();

addFormats(ajv);

const validateManifest = ajv.compile<Manifest>(manifestSchema);

export class ParseManifestError extends Error {
	constructor(message: string, public readonly errors: ErrorObject[]) {
		super(message);
		this.name = 'ParseManifestError';
	}

	public toString(): string {
		return `${this.name}: ${this.message}\n${this.errors.map((error) => error.message).join('\n')}`;
	}
}

/**
 * Parses a manifest and validates it against the JSON schema.
 * @param manifest The manifest to parse.
 * @throws {ParseManifestError} If the manifest is invalid.
 * @returns The parsed manifest.
 */
export const parseManifest = (
  manifest: Record<string, any>,
): Manifest => {
	const isValid = validateManifest(manifest);

	if (!isValid) {
		throw new ParseManifestError('Invalid manifest', validateManifest.errors ?? []);
	}

	return manifest;
};
