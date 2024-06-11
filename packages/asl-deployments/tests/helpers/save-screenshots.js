import Git from '@lennym/commit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

if (!process.env.GITHUB_ACCESS_TOKEN) {
  throw new Error('GITHUB_ACCESS_TOKEN is required');
}
if (!process.env.CI || !process.env.DRONE_BUILD_NUMBER) {
  console.log('No CI build detected');
  process.exit(0);
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dir = path.resolve(__dirname, '../');
const repo = 'ukhomeoffice/asl-deployments';
const token = process.env.GITHUB_ACCESS_TOKEN;

const branch = `failures-${process.env.DRONE_BUILD_NUMBER}`;

const client = Git({
  repo,
  token
});

const screenshots = fs.readdirSync(path.join(dir, 'actual'))
  .map(name => {
    return {
      name: `tests/actual/${name}`,
      content: fs.readFileSync(path.resolve(dir, 'actual', name))
    };
  });

if (!screenshots.length) {
  process.exit(0);
}

screenshots.forEach(file => {
  client.add(file.name, file.content);
});

client
  .branch(branch)
  .commit(`Test failures from build ${process.env.DRONE_BUILD_NUMBER}`)
  .push()
  .catch(e => {
    console.error(e.stack);
  });
