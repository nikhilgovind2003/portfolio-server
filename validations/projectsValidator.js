const { body, param } = require('express-validator');

// Validation for creating a new project
const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Project title must be between 2 and 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Project description must be between 10 and 1000 characters'),

  body('media_alt')
    .trim()
    .notEmpty()
    .withMessage('Media alt text is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Media alt text must be between 2 and 100 characters'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isBoolean()
    .withMessage('Status must be true or false'),

  body('sort_order')
    .notEmpty()
    .withMessage('Sort order is required')
    .isInt({ min: 0 })
    .withMessage('Sort order must be a positive integer'),

  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array')
    .custom((value) => {
      if (value && !value.every(id => Number.isInteger(id))) {
        throw new Error('All skill IDs must be integers');
      }
      return true;
    }),
];

// Validation for updating a project
const updateProjectValidation = [
  param('id')
    .notEmpty()
    .withMessage('Project ID is required')
    .isInt()
    .withMessage('Project ID must be an integer'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Project title must be between 2 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Project description must be between 10 and 1000 characters'),

  body('media_alt')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Media alt text must be between 2 and 100 characters'),

  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be true or false'),

  body('sort_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a positive integer'),

  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array')
    .custom((value) => {
      if (value && !value.every(id => Number.isInteger(id))) {
        throw new Error('All skill IDs must be integers');
      }
      return true;
    }),
];

// Validation for managing project-skill associations
const projectSkillValidation = [
  param('id')
    .notEmpty()
    .withMessage('Project ID is required')
    .isInt()
    .withMessage('Project ID must be an integer'),

  body('skillIds')
    .notEmpty()
    .withMessage('Skill IDs are required')
    .isArray()
    .withMessage('Skill IDs must be an array')
    .custom((value) => {
      if (!value.every(id => Number.isInteger(id))) {
        throw new Error('All skill IDs must be integers');
      }
      return true;
    }),
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
  projectSkillValidation,
};
