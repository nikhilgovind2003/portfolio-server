const { body, validationResult } = require("express-validator");

// Validation rules for update
const updateCmsRules = [
  body("super_title").isString().withMessage("Super title must be a string"),
  body("title").isString().withMessage("Title must be a string"),
  body("description").isString().withMessage("Description must be a string"),
  body("btn_one_text").isString().withMessage("Button one text must be a string"),
  body("btn_one_link").isString().withMessage("Button one link must be a string"),
  body("btn_two_text").isString().withMessage("Button two text must be a string"),
  body("btn_two_link").isString().withMessage("Button two link must be a string"),
  body("media_alt").isString().withMessage("Media alt text must be a string"),
  body("project_title").isString().withMessage("Project title must be a string"),
  body("skills_title").isString().withMessage("Skills title must be a string"),
  body("about_title").isString().withMessage("About title must be a string"),
  body("about_description").isString().withMessage("About description must be a string"),
  body("contact_title").isString().withMessage("Contact title must be a string"),
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
