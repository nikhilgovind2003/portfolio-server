const { Skills } = require("../models/index");
const path = require("path");
const PaginationHelper = require("../utils/paginationHelper");
const fs = require("fs").promises;
const logger = require("../config/logger");

class SkillsController {
  static async deleteFile(filePath) {
    if (!filePath) return false;
    try {
      const absolutePath = path.join(
        __dirname,
        "..",
        "..",
        filePath.replace(/\\/g, "/")
      );

      await fs.unlink(absolutePath);

      logger.info(`Deleted file: ${absolutePath}`);
      return true; // ✅ success
    } catch (error) {
      if (error.code !== "ENOENT") {
        logger.error(`Failed to delete file ${filePath}: ${error.message}`);
      }
      return false; // ✅ failed but handled
    }
  }

 static async getAll(req, res, next) {
    try {
      const { page, limit, offset } = PaginationHelper.getPaginationParams(req);
      const { search, status } = req.query;

      // Build filter
      const filter = {};
      
      if (search) {
        filter.skills = { $regex: search, $options: 'i' };
      }

      if (status !== undefined) {
        filter.status = status === 'true';
      }

      // Fetch data with pagination
      const totalItems = await Skills.countDocuments(filter);
      const rows = await Skills.find(filter)
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
  static async create(req, res, next) {
    try {
      const dataModel = req.body;
      const media_path = req.files?.media_path?.[0]?.relativePath ?? null;

      const existingSkil = await Skills.findOne({
        skills: { $regex: new RegExp(`^${dataModel.skills}$`, 'i') }
      });

      if (existingSkil) {
        return res.status(400).json({ message: "Skill already exists" });
      }

      // Mongoose doesn't need to specify media_path if it's in ...dataModel, but we separated it in original code logic?
      // Mongoose create takes object.
      
      // Ensure specific fields are boolean/number if passed as string from multipart form data
      if (dataModel.status !== undefined) dataModel.status = dataModel.status === 'true' || dataModel.status === true;
      if (dataModel.sort_order !== undefined) dataModel.sort_order = parseInt(dataModel.sort_order);

      const newSkill = await Skills.create({ ...dataModel, media_path });
      res.status(201).json(newSkill);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const skill = await Skills.findById(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      res.json(skill);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      let skill = await Skills.findById(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      if (req.files) {
        // Save old path before overwriting
        const oldFilePath = skill.media_path;

        // Set new file path
        if (req.files.media_path) {
           skill.media_path = req.files.media_path[0].relativePath;
           // Delete old file
            if (oldFilePath) {
              await SkillsController.deleteFile(oldFilePath);
            }
        }
      }
      
      // Update fields
      if (data.skills) skill.skills = data.skills;
      if (data.media_alt) skill.media_alt = data.media_alt;
      if (data.status !== undefined) skill.status = data.status === 'true' || data.status === true;
      if (data.sort_order !== undefined) skill.sort_order = parseInt(data.sort_order);

      await skill.save();

      res.json(skill);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const skill = await Skills.findById(id);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
       // Remove file if exists
      if (skill.media_path) {
        await SkillsController.deleteFile(skill.media_path);
      }
      
      await Skills.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Skill deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SkillsController;
