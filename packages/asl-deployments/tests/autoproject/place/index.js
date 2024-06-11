import pipeline from '../utils/pipeline.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default ({ env, args }) => {
  const steps = [
    'create',
    'grant',
    'edit',
    'grant',
    'verify'
  ];

  const datetime = moment().format('YYYY-MM-DD hh:mm:ss');
  const PLACE_NAME = args.name || `Autoproject place ${datetime}`;

  return pipeline(steps, { root: __dirname, env: { ...env, PLACE_NAME } });
};
