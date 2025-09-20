const { body, param } = require('express-validator');

// Validation for creating a new skill
const createSkillValidation = [
  body('skills')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Skill name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-\+]+$/)
    .withMessage('Skill name can only contain letters, numbers, spaces, - and +'),
  
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
];

const updateSkillValidation = [
  param('id')
    .notEmpty()
    .withMessage('Skill ID is required')
    .isInt()
    .withMessage('Skill ID must be an integer'),
];

module.exports = {
  createSkillValidation,
  updateSkillValidation,
};
