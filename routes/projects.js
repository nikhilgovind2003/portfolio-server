const router = require("express").Router();
const ProjectsController = require("../controller/projectsController");
const createUploadMiddleware = require("../middlewares/multerMiddleware");
const {
  createProjectValidation,
  updateProjectValidation,
  projectSkillValidation,
} = require("../validations/projectsValidator");

// Dynamic upload middleware
const { upload, replaceFile } = createUploadMiddleware("projects");

// Attach replaceFile to req for controller
router.use((req, res, next) => {
  req.replaceFile = replaceFile;
  next();
});

// Get all projects
router.get("/", ProjectsController.getAll);

// Get a single project
router.get("/:id", ProjectsController.getById);

// Create a new project
router.post(
  "/",
  createProjectValidation,
  upload.single("media_path"),
  ProjectsController.create
);

// Update a project
router.put(
  "/:id",
  updateProjectValidation,
  upload.single("media_path"),
  ProjectsController.update
);

// Set skills for project (replaces all existing skills)
router.put("/:id/skills", ProjectsController.setProjectSkills);

// Add skills to project
router.post("/:id/skills", projectSkillValidation, ProjectsController.addSkillsToProject);

// Remove skills from project
router.delete("/:id/skills", projectSkillValidation, ProjectsController.removeSkillsFromProject);

// Delete a project
router.delete("/:id", ProjectsController.delete);

module.exports = router;
