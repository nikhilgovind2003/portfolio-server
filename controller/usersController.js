const { User } = require("../models");

class UsersController {
  static async getAll(req, res, next) {
    try {
      const users = await User.findAll({
        order: [["created_at", "DESC"]],
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, email } = req.body;

      // Check if user with email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const user = await User.create({ name, email });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if email is being changed and if it already exists
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists" });
        }
      }

      await user.update({ name: name || user.name, email: email || user.email });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();
      res.status(200).json({ 
        success: true, 
        message: "User deleted successfully" 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
