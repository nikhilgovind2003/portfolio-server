const { body, param } = require("express-validator");

// Validation for creating a new project
const createMessageValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("name must be between 2 and 100 characters"),

  body("message")
    .notEmpty()
    .withMessage("message is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("message must be between 10 and 1000 characters"),
];


module.exports = {
  createMessageValidation,
};
