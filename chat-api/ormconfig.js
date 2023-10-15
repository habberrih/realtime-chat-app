const { join } = require('path');
require('dotenv').config()
module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: true,
  entities: [join(__dirname, '/**/**.entity.ts')],
};