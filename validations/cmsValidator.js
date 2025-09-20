const { body, validationResult } = require("express-validator");

// Validation rules for update
const updateCmsRules = [
  body("super_title").optional().isString().withMessage("Super title must be a string"),
  body("title").optional().isString().withMessage("Title must be a string"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("btn_one_text").optional().isString().withMessage("Button one text must be a string"),
  body("btn_one_link").optional().isString().withMessage("Button one link must be a string"),
  body("btn_two_text").optional().isString().withMessage("Button two text must be a string"),
  body("btn_two_link").optional().isString().withMessage("Button two link must be a string"),
  body("media_alt").optional().isString().withMessage("Media alt text must be a string"),
  body("project_title").optional().isString().withMessage("Project title must be a string"),
  body("skills_title").optional().isString().withMessage("Skills title must be a string"),
  body("about_title").optional().isString().withMessage("About title must be a string"),
  body("about_description").optional().isString().withMessage("About description must be a string"),
  body("contact_title").optional().isString().withMessage("Contact title must be a string"),
];

// Middleware to check validation results
function validateCms(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

module.exports = { updateCmsRules, validateCms };
