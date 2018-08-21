try {
  // eslint-disable-next-line implicit-dependencies/no-implicit
  require('dotenv').config();
} catch (e) {}

module.exports = {

  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DATABASE_HOST || 'localhost',
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME || 'asl-test'
    }
  },

  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD
    }
  }

};
