const { Technology } = require("../models");
const PaginationHelper = require("../utils/paginationHelper");

// Technology Controller
class TechnologyController {
  // Create new Technology
  static async store(req, res) {
    try {
      const data = { ...req.body };
      
      // Check if technology already exists
      const exists = await Technology.findOne({ name: data?.name });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Technology already exists",
        });
      }

      if (data.status !== undefined) data.status = data.status === 'true' || data.status === true;
      if (data.sort_order !== undefined) data.sort_order = parseInt(data.sort_order);

      const tech = await Technology.create(data);

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
 static async index(req, res, next) {
    try {
      const { page, limit, offset } = PaginationHelper.getPaginationParams(req);
      const { search, status } = req.query;

      // Build filter
      const filter = {};
      
      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }

      if (status !== undefined) {
        filter.status = status === 'true';
      }

      // Fetch data with pagination
      const totalItems = await Technology.countDocuments(filter);
      const rows = await Technology.find(filter)
        .sort({ sort_order: 1 })
        .skip(offset)
        .limit(limit);

      // Format response
      const response = PaginationHelper.formatResponse(rows, totalItems, page, limit);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

    static async shows(req, res) {
    try {
      const Technologies = await Technology.find({ status: true });

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
      const tech = await Technology.findById(id);

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
      const data = { ...req.body };
      let tech = await Technology.findById(id);
      
      if (!tech) {
        return res.status(404).json({
          success: false,
          message: "Technology not found",
        });
      }
      
      if (data.name) tech.name = data.name;
      if (data.status !== undefined) tech.status = data.status === 'true' || data.status === true;
      if (data.sort_order !== undefined) tech.sort_order = parseInt(data.sort_order);

      const updatedData = await tech.save();
      
      return res.status(200).json({
        success: true,
        message: "Technology updated successfully",
        data: updatedData,
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
      const tech = await Technology.findByIdAndDelete(id);

      if (!tech) {
        return res.status(404).json({
          success: false,
          message: "Technology not found",
        });
      }

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
