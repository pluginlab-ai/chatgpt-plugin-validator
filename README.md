<p align="center">
<a href="https://www.pluginlab.ai">
  <img width="250" height="250" src="https://uploads-ssl.webflow.com/6446ea87f99b6dc7c2e8c9cb/64470266b86f5166fd19a752_white-logo.svg">
  </a>
</p>

Want to host or set up analytics for your ChatGPT plugin in minutes ? Check out [pluginlab.ai](https://www.pluginlab.ai) !


# ChatGPT Plugin Validator

A package that validates ChatGPT plugin manifests and ensure they follow the security guidelines.

## Installation

Install the package:

```bash
npm install --save @pluginlab/chatgpt-plugin-validator
```

## Usage

### Parse and validate a plugin manifest

To parse a plugin manifest, use the `parseManifest` function:

```ts
import { parseManifest } from '@pluginlab/chatgpt-plugin-validator';
// assuming we are in a Node.js environment, loading the manifest from a file
import { readFileSync } from 'fs';

const manifestData = readFileSync('manifest.json', 'utf-8');
const json = JSON.parse(manifest);

const [manifest, parseError] = parseManifest(json);

if (parseError) {
    throw parseError;
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

const [rootDomain1, domain1Error] = getRootDomain('myplugin.pluginlab.ai'); // rootDomain1 should be 'myplugin.pluginlab.ai'
const [rootDomain2, domain2Error] = getRootDomain('www.pluginlab.ai'); // rootDomain2 should be 'pluginlab.ai'
```