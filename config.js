require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  db: {
    databaseUrl: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'portfolio_db',
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASS || 'postgres',
    ssl: (process.env.DB_SSL || 'false').toLowerCase() === 'true',
  },
};

module.exports = config;


