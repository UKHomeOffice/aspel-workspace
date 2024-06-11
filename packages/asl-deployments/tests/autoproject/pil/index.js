import pipeline from '../utils/pipeline.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default ({ env, args }) => {
  const steps = [
    'apply',
    'endorse',
    'grant',
    'verify'
  ];
  return pipeline(steps, { root: __dirname, env });
};
