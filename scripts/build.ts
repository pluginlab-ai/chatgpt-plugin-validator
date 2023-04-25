import { build } from 'esbuild';
import { join } from 'path';
import colors from 'colors';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
);

const log = (s: string) => {
  console.log(
    `${colors.cyan(`${packageJson.name}`)} ${colors.gray('>>')} ${s}`,
  );
};

const buildPackage = async () => {
  await build({
    external: [
      ...Object.keys(packageJson.devDependencies),
      ...Object.keys(packageJson.dependencies),
    ],
    minify: false,
    target: 'ES2015',
    format: 'esm',
    bundle: true,
    entryPoints: [join(process.cwd(), 'src', 'index.ts')],
    outfile: packageJson.main,
  });
};

const main = async () => {
  const startTime = process.hrtime.bigint();

  log(`Building...`);
  await buildPackage();

  const endTime = process.hrtime.bigint();
  const msDiff = (endTime - startTime) / BigInt(1e6);

  log(`Built in ${msDiff}ms 🚀.`);
};

main();
