const router = require("express").Router();
const UsersController = require("../controller/usersController");
const auth = require("../middlewares/authMiddleware");
const {
  createUserValidation,
} = require("../validations/usersValidator");

// router.use(auth)
// Get all users
router.get("/", UsersController.getAll);

// Get a single user
router.get("/:id", UsersController.getById);

// Create a new user
router.post("/", createUserValidation, UsersController.create);
 
// Update a user
router.put("/:id", UsersController.update);

module.exports = router;
