const { body, param } = require("express-validator");

const createTechnologyValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Technology name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Technology name must be between 2 and 50 characters")
];

const updateTechnologyValidation = [
  param("id")
    .isMongoId()
    .withMessage("Valid technology ID is required"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Technology name must be between 2 and 50 characters")
];

module.exports = {
  createTechnologyValidation,
  updateTechnologyValidation,
};
