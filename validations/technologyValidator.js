const { body, param } = require("express-validator");

const createTechnologyValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Technology name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Technology name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-\+]+$/)
    .withMessage("Technology name can only contain letters, numbers, spaces, + and -"),
];

const updateTechnologyValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Valid technology ID is required"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Technology name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-\+]+$/)
    .withMessage("Technology name can only contain letters, numbers, spaces, + and -"),
];

module.exports = {
  createTechnologyValidation,
  updateTechnologyValidation,
};
