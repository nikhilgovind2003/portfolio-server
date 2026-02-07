const bcrypt = require("bcrypt");
const { Auth } = require("../models/index.js");
const generateToken = require("../utils/generateToken");

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find single user by email
      const user = await Auth.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  // @access  Public
  static async register(req, res, next) {
    try {
      const { userName, email, password } = req.body;

      // Check for user email and password
      const userExists = await Auth.findOne({ email });
      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Create user
      const user = await Auth.create({
        userName,
        email,
        password: hashedPassword,
      });
      res.status(201).json({
        success: true,
        result: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
