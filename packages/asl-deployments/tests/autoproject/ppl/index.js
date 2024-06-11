import pipeline from '../utils/pipeline.js';
import { sentence } from '../utils/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const LEGACY_TITLE = 'Legacy Autoproject Draft';

export default async ({ env, args }) => {
  const steps = [
    'apply',
    'endorse',
    'return',
    'resubmit',
    'grant',
    'verify'
  ];
  const FAST = args.fast ? 'yes' : '';
  const PROJECT_TITLE = args.title || args.legacy
    ? LEGACY_TITLE
    : await sentence(6, 15, false);
  const LEGACY = args.legacy ? 'true' : '';

  return pipeline(steps, { root: __dirname, env: { ...env, FAST, PROJECT_TITLE, LEGACY } });
};
