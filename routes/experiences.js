const router = require("express").Router();
const ExperienceController = require("../controller/experienceController");
const auth = require("../middlewares/authMiddleware");
const { uploadFields } = require("../middlewares/multerMiddleware");
const {
  createExperienceValidation,
  updateExperienceValidation,
  validateExperience,
} = require("../validations/experienceValidator");

const uploads = uploadFields("experience", [{ name: "media_path", maxCount: 1 }]);

// Get all experiences
router.get("/", ExperienceController.getAll);

// Get a single experience
router.get("/:id", ExperienceController.getById);

// Create a new experience
router.post(
  "/",
  // auth,
  uploads,
  createExperienceValidation,
  validateExperience,
  ExperienceController.create
);

// Update an experience
router.put(
  "/:id",
  // auth,
  uploads,
  updateExperienceValidation,
  validateExperience,
  ExperienceController.update
);

// Delete an experience
router.delete("/:id", /* auth, */ ExperienceController.delete);

module.exports = router;
