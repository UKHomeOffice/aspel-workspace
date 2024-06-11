import { config } from 'dotenv';
import path from 'path';
import { spawn } from 'child_process';

try {
  config();
} catch (e) {}

const runPipelineStep = (file, env) => {
  const proc = spawn('npm', ['run', 'autoproject:run', '--', file], { env, stdio: 'inherit' });
  return new Promise((resolve, reject) => {
    proc.on('close', code => {
      if (code) {
        const err = new Error('Test run failed');
        err.code = code;
        return reject(err);
      }
      resolve();
    });
    proc.on('error', reject);
  });
};

export default (steps, { root, env }) => {
  env = { ...process.env, ...env };
  return steps.reduce((p, step) => {
    const filename = path.join(root, step, 'config.js');
    return p.then(() => {
      console.log(`Executing test pipeline step: ${step}`);
      return runPipelineStep(filename, env);
    });
  }, Promise.resolve());
};
