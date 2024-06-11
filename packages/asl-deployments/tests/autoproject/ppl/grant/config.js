import config from '../../utils/config.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filename = process.env.LEGACY === 'true' ? 'legacy' : 'index';

export default config(`${__dirname}/specs/${filename}.js`);
