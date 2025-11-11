const router = require("express").Router();
const ProjectsController = require("../controller/projectsController");
const auth = require("../middlewares/authMiddleware");
const uploadImage = require("../middlewares/multerMiddleware");
const {
  createProjectValidation,
  updateProjectValidation,
  projectSkillValidation,
} = require("../validations/projectsValidator");

// router.use(auth)
// Create a new project
router.post(
  "/",
  createProjectValidation,
  uploadImage("projects", "media_path"),
  ProjectsController.create
);

// Get all projects
router.get("/", ProjectsController.getAll);

// Get a single project
router.get("/:id", ProjectsController.getById);

// Update a project
router.put(
  "/:id",
  updateProjectValidation,
  uploadImage("projects", "media_path"),
  ProjectsController.update
);

// Set skills for project (replaces all existing skills)
router.put("/:id/skills", ProjectsController.setProjectSkills);

// Add skills to project
router.post(
  "/:id/skills",
  projectSkillValidation,
  ProjectsController.addSkillsToProject
);

// Remove skills from project
router.delete(
  "/:id/skills",
  projectSkillValidation,
  ProjectsController.removeSkillsFromProject
);

// Delete a project
router.delete("/:id", ProjectsController.delete);

module.exports = router;
