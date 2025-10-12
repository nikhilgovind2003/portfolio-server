const router = require("express").Router();
const UsersController = require("../controller/usersController");
const auth = require("../middlewares/authMiddleware");
const {
  createUserValidation,
  updateUserValidation,
} = require("../validations/usersValidator");

router.use(auth)
// Get all users
router.get("/", UsersController.getAll);

// Get a single user
router.get("/:id", UsersController.getById);

// Create a new user
router.post("/", createUserValidation, UsersController.create);

module.exports = router;
