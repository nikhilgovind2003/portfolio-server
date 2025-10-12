const router = require("express").Router();
const AuthController = require("../controller/authController");

// Login
router.post("/login", AuthController.login);

// Register
router.post("/register", AuthController.register);

module.exports = router;
