const router = require("express").Router();
const ProjectsController = require("../controller/projectsController");
const auth = require("../middlewares/authMiddleware");
const { uploadFields } = require("../middlewares/multerMiddleware");
const {
  createProjectValidation,
  updateProjectValidation,
  projectSkillValidation,
} = require("../validations/projectsValidator");



const uploads = uploadFields("projects", [{ name: "media_path", maxCount: 1 }]);


// router.use(auth)
// Create a new project
router.post(
  "/",
  createProjectValidation,
  uploads,
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
  uploads,
  ProjectsController.update
);


// Delete a project
router.delete("/:id", ProjectsController.delete);

module.exports = router;
