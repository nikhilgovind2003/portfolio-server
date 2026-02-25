const { body, param, validationResult } = require('express-validator');

const createExperienceValidation = [
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isBoolean().withMessage('Status must be a boolean'),
  body('is_current').optional().isBoolean().withMessage('Is current must be a boolean'),
  body('start_date').notEmpty().withMessage('Start date is required'),
];

const updateExperienceValidation = [
  param('id').notEmpty().withMessage('Experience ID is required'),
];

const validateExperience = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  createExperienceValidation,
  updateExperienceValidation,
  validateExperience,
};
