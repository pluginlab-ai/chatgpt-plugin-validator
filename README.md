<p align="center">
<a href="https://www.pluginlab.ai">
  <img width="250" height="250" src="https://uploads-ssl.webflow.com/6446ea87f99b6dc7c2e8c9cb/64470266b86f5166fd19a752_white-logo.svg">
  </a>
</p>

Want to get users and start making money out of your ChatGPT plugin? Check out [pluginlab.ai](https://www.pluginlab.ai) !


# ChatGPT Plugin Validator

A package that validates ChatGPT plugin manifests and ensure they follow the security guidelines.

## Installation

Install the package:

```bash
npm install --save @pluginlab/chatgpt-plugin-validator
```

# Migrate to V1

## ESM to CJS migration

The package now gets compiled to CJS which is also supported by ESM environments.
That choice was made to make it easy to get it working on nodejs-powered backends.
Many frameworks are not ready to support ESM yet.

## Parsing the manifest

The signature of the `parseManifest` method was changed to better fit javascript coding standards.
Now `parseManifest` returns the typed manifest if it is correct or throws a `ParseManifestError` that contains the parsing errors otherwise.

## Getting root domain

Same thing than for parsing the manifest. The signature has been rewritten in a more idiomatic way.
It either returns the root domain or throws an error if the domain is not parsable for some reason.

## Usage

### Parse and validate a plugin manifest

```ts
import { parseManifest, ParseManifestError } from '@pluginlab/chatgpt-plugin-validator';
// assuming we are in a Node.js environment, loading the manifest from a file
import { readFileSync } from 'fs';

const manifestData = readFileSync('manifest.json', 'utf-8');
const json = JSON.parse(manifest);

try {
    const manifest = parseManifest(json);
} catch (error) {
    if (error instanceof ParseManifestError) {
        console.error(`Failed to parse manifest: ${error}`);
    }

    throw error;
}

console.log(`Successfully loaded manifest for plugin ${manifest.name_for_human}.`);
```

This function validates the manifest against a JSON schema that can be found in this repo.
We rely on AJV for the validation work.

### Validate static domain constraints

As part of their security guidelines, ChatGPT requires that plugins respect a set of constraints when it comes to the domains they use.
More on that [here](https://platform.openai.com/docs/plugins/production/domain-verification-and-security).

This package exports a function that checks constraints that are relative to the `legal_info`, `contact_info` and `api.url` fields of the manifest.

It does NOT ensure that redirections are done properly as asked by the guidelines.

```ts
import { validateStaticDomainConstraints } from '@pluginlab/chatgpt-plugin-validator';

const manifestDomain = 'www.aurelienbrabant.fr';
const errors = validateStaticDomainConstraints(manifestDomain, parsedManifest);

if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join('\n'));
}

console.log('All static domain constraints are respected.');
```

### Getting the root domain of your plugin

As stated by OpenAI, the root domain of a plugin is the domain used to host the manifest or a slightly modified version of it.
Read more about it [here](https://platform.openai.com/docs/plugins/production/defining-the-plugin-s-root-domain).

This package exports a function that, given the domain of the manifest, returns the root domain of the plugin.
**Most of the functions exported by this package already call this function internally, so you shouldn't need to call it yourself in most cases.**

```ts
import { getRootDomain } from '@pluginlab/chatgpt-plugin-validator';

const rootDomain1 = getRootDomain('myplugin.pluginlab.ai'); // rootDomain1 should be 'myplugin.pluginlab.ai'
const rootDomain2 = getRootDomain('www.pluginlab.ai'); // rootDomain2 should be 'pluginlab.ai'
```
