const User = require('./User');
const Cms = require('./cms');
const Projects = require('./project');
const Skills = require('./skills');
const Contact = require('./contact');
const Technology = require('./technology');
const Auth = require("./auth");
const Experience = require("./experience");

const models = {
  User,
  Cms,
  Projects,
  Skills,
  Contact,
  Technology,
  Auth,
  Experience,
};

module.exports = { ...models };
