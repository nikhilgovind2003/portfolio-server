const router = require("express").Router();
const SkillsController = require("../controller/skillsController");
const auth = require("../middlewares/authMiddleware");
const { createSkillValidation, updateSkillValidation } = require("../validations/skillsValidator");


router.use(auth)
// Get all skills
router.get("/", SkillsController.getAll);

// Get a single skill
router.get("/:id", SkillsController.getById);

// Get projects by skill
router.get("/:id/projects", SkillsController.getProjectsBySkill);

// Create a new skil
router.post("/", createSkillValidation, SkillsController.create);

// Update a skill
router.put("/:id", updateSkillValidation, SkillsController.update);

// Delete a skill
router.delete("/:id", SkillsController.delete);

module.exports = router;