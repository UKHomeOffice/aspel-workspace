import config from '../../utils/config.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default config(`${__dirname}/specs/index.js`, 'internal');
