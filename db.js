const { Sequelize } = require('sequelize');
const config = require('./config');

let sequelize;
if (config.db.databaseUrl) {
  sequelize = new Sequelize(config.db.databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: config.db.ssl
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  });
} else {
  sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: false,
    dialectOptions: config.db.ssl
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  });
}

async function verifyDatabaseConnection() {
  await sequelize.authenticate();
}

module.exports = { sequelize, verifyDatabaseConnection };

