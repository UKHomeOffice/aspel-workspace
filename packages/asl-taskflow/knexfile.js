const { knexSnakeCaseMappers } = require('objection');

const snakeCaseMapper = process.env.SNAKE_MAPPER ? knexSnakeCaseMappers() : {};

module.exports = {

  test: {
    ...snakeCaseMapper,
    client: 'postgres',
    connection: {
      host: process.env.TASKFLOW_POSTGRES_HOST || 'localhost',
      user: process.env.TASKFLOW_POSTGRES_USER || 'postgres',
      password: process.env.TASKFLOW_POSTGRES_PASSWORD,
      database: process.env.TASKFLOW_POSTGRES_DATABASE || 'taskflow-test',
      port: process.env.TASKFLOW_POSTGRES_PORT || 5432
    }
  }

};
