const { body, param } = require("express-validator");

// Helper: Validate technologies array
const validateTechnologies = body("technologies")
  .optional()
  .custom((value) => {
    let techArray = value;

    // If value is string (from form-data), parse it
    if (typeof value === "string") {
      try {
        techArray = JSON.parse(value);
      } catch {
        throw new Error("Technologies must be a valid JSON array");
      }
    }

    // Must be an array
    if (!Array.isArray(techArray)) {
      throw new Error("Technologies must be an array");
    }

    // Each element must be integer
    if (!techArray.every((id) => Number.isInteger(id))) {
      throw new Error("All technology IDs must be integers");
    }

    return true;
  });

// ===============================
// 🚀 CREATE PROJECT VALIDATION
// ===============================
const createProjectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Project title must be between 2 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Project description must be between 10 and 2000 characters"),

  // media_path is removed because it comes from req.file

  body("media_alt")
    .trim()
    .notEmpty()
    .withMessage("Media alt text is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Media alt must be 2–100 characters"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isBoolean()
    .withMessage("Status must be true or false"),

  body("sort_order")
    .notEmpty()
    .withMessage("Sort order is required")
    .isInt({ min: 0 })
    .withMessage("Sort order must be a positive integer"),

  validateTechnologies,
];

// ===============================
// 🚀 UPDATE PROJECT VALIDATION
// ===============================
const updateProjectValidation = [
  param("id")
    .notEmpty()
    .withMessage("Project ID is required")
    .isInt()
    .withMessage("Project ID must be an integer"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Project title must be between 2 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Project description must be between 10 and 2000 characters"),

  // media_path removed (file upload)

  body("media_alt")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Media alt must be 2–100 characters"),

  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be true or false"),

  body("sort_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a positive integer"),

  validateTechnologies,
];

// ===============================
// 🚀 VALIDATION FOR PROJECT–TECH RELATIONS
// ===============================
const projectSkillValidation = [
  param("id")
    .notEmpty()
    .withMessage("Project ID is required")
    .isInt()
    .withMessage("Project ID must be an integer"),
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
  projectSkillValidation,
};
