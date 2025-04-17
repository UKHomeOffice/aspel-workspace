import { config as loadEnv } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if required environment variables are already set
if (!process.env.DATA_DB_NAME || !process.env.TASKFLOW_DB_NAME) {
  // Resolve the path to .env.dist
  const envPath = path.resolve(__dirname, '../../.env.dist');

  // Load environment variables from .env.dist
  loadEnv({ path: envPath });
}

export const data = {
  database: process.env.DATA_DB_NAME,
  host: process.env.DATA_DB_HOST,
  port: process.env.DATA_DB_PORT,
  password: process.env.DATA_DB_RW_PASSWORD,
  username: process.env.DATA_DB_RW_USERNAME
};

export const taskflow = {
  database: process.env.TASKFLOW_DB_NAME,
  host: process.env.TASKFLOW_DB_HOST,
  port: process.env.TASKFLOW_DB_PORT,
  password: process.env.TASKFLOW_DB_RW_PASSWORD,
  username: process.env.TASKFLOW_DB_RW_USERNAME
};
