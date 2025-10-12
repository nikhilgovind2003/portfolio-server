const router = require("express").Router();
const TechnologyController = require("../controller/technologyController");
const { createTechnologyValidation, updateTechnologyValidation } = require("../validations/technologyValidator");
const { validationResult } = require("express-validator");

// Middleware to handle validation errors
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Routes

// Get all technologies
router.get("/", TechnologyController.index);


// Create new technology
router.post("/", createTechnologyValidation, validate, TechnologyController.store);

// Update technology
router.put("/:id", updateTechnologyValidation, validate, TechnologyController.update);

// Delete technology
router.delete("/:id", TechnologyController.destroy);

module.exports = router;
