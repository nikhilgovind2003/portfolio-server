const { Technology } = require("../models");

// Technology Controller
class TechnologyController {
  // Create new Technology
  static async store(req, res) {
    try {
      const { name } = req.body;

      // Check if technology already exists
      const exists = await Technology.findOne({ where: { name } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Technology already exists",
        });
      }

      const tech = await Technology.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Technology created successfully",
        data: tech,
      });
    } catch (error) {
      console.error("Error creating technology:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  // Get all Technology
  static async index(req, res) {
    try {
      const Technologies = await Technology.findAll();

      return res.status(200).json({
        success: true,
        data: Technologies,
      });
    } catch (error) {
      console.error("Error fetching Technology:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  // Get single Technology by id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const tech = await Technology.findByPk(id);

      if (!tech) {
        return res.status(404).json({
          success: false,
          message: "Technology not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: tech,
      });
    } catch (error) {
      console.error("Error fetching technology:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  // Update Technology
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const tech = await Technology.findByPk(id);
      if (!tech) {
        return res.status(404).json({
          success: false,
          message: "Technology not found",
        });
      }

      tech.name = name;
      await tech.save();

      return res.status(200).json({
        success: true,
        message: "Technology updated successfully",
        data: tech,
      });
    } catch (error) {
      console.error("Error updating technology:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  // Delete Technology
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const tech = await Technology.findByPk(id);

      if (!tech) {
        return res.status(404).json({
          success: false,
          message: "Technology not found",
        });
      }

      await tech.destroy();

      return res.status(200).json({
        success: true,
        message: "Technology deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting technology:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
}

module.exports = TechnologyController;
