const router = require("express").Router();
const UsersController = require("../controller/usersController");
const {
  createUserValidation,
  updateUserValidation,
} = require("../validations/usersValidator");

// Get all users
router.get("/", UsersController.getAll);

// Get a single user
router.get("/:id", UsersController.getById);

// Create a new user
router.post("/", createUserValidation, UsersController.create);

// Update a user
router.put("/:id", updateUserValidation, UsersController.update);

// Delete a user
router.delete("/:id", UsersController.delete);

module.exports = router;
