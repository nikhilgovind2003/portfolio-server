const { User } = require("../models/index");
const PaginationHelper = require("../utils/paginationHelper");

class UsersController {
 static async getAll(req, res, next) {
    try {
      const { page, limit, offset } = PaginationHelper.getPaginationParams(req);
      const { search } = req.query;

      // Build filter
      const filter = {};
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Fetch data with pagination
      const totalItems = await User.countDocuments(filter);
      const rows = await User.find(filter)
        .skip(offset)
        .limit(limit);

      // Format response
      const response = PaginationHelper.formatResponse(rows, totalItems, page, limit);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

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
      const existingUser = await User.findOne({ email });
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

      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if email is being changed and if it already exists
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists" });
        }
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
      
      await user.save();
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

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
