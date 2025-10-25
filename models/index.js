const { sequelize } = require('../db');

const defineUser = require('./User');
const defineCms = require('./cms');
const defineProject = require('./project');
const defineSkills = require('./skills');
const defineContact = require('./contact');
const defineTechnology  = require('./technology');
const defineAuth = require("./auth")
const defineProjectTech = require("./ProjectTechnology");
const ProjectTechnology = require('./ProjectTechnology');

const models = {
  User: defineUser(sequelize),
  Cms: defineCms(sequelize),
  Projects: defineProject(sequelize),
  Skills: defineSkills(sequelize),
  Contact: defineContact(sequelize),
  Technology: defineTechnology(sequelize),
  Auth: defineAuth(sequelize),
  ProjectTechnologies: defineProjectTech(sequelize)
};

// Define associations after all models are loaded
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, ...models };

