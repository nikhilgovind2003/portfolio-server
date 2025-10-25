const router = require("express").Router();
const SkillsController = require("../controller/skillsController");
const auth = require("../middlewares/authMiddleware");
const uploadImage = require("../middlewares/multerMiddleware");
const {
  createSkillValidation,
  updateSkillValidation,
} = require("../validations/skillsValidator");

router.use(auth);
// Get all skills
router.get("/", SkillsController.getAll);

// Get a single skill
router.get("/:id", SkillsController.getById);

// Get projects by skill
// router.get("/:id/projects", SkillsController.getProjectsBySkill);

// Create a new skil
router.post(
  "/",
  createSkillValidation,
  uploadImage("skills", "media_path"),
  SkillsController.create
);

// Update a skill
router.put(
  "/:id",
  updateSkillValidation,
  uploadImage("skills", "media_path"),
  SkillsController.update
);

// Delete a skill
router.delete("/:id", SkillsController.delete);

module.exports = router;
