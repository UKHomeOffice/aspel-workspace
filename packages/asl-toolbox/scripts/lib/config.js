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
