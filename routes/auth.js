const router = require("express").Router();
const AuthController = require("../controller/authController");

// Login
router.post("/login", AuthController.login);

// Register
router.post("/register", AuthController.register);
 
// Update profile
router.put("/profile/:id", AuthController.updateProfile);
 
module.exports = router;
