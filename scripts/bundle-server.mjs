import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outfile = path.join(repoRoot, 'server', 'bundle', 'index.cjs');

await mkdir(path.dirname(outfile), { recursive: true });

await build({
  entryPoints: [path.join(repoRoot, 'server', 'src', 'index.ts')],
  outfile,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node20',
  packages: 'bundle',
  sourcemap: false,
  logLevel: 'info',
});
