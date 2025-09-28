const { sequelize } = require('../db');

const defineUser = require('./User');
const defineCms = require('./cms');
const defineProject = require('./project');
const defineSkills = require('./skills');
const defineContact = require('./contact');

const models = {
  User: defineUser(sequelize),
  Cms: defineCms(sequelize),
  Projects: defineProject(sequelize),
  Skills: defineSkills(sequelize),
  Contact: defineContact(sequelize),
};

// Define associations after all models are loaded
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, ...models };

