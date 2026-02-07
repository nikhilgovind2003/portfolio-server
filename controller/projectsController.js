const path = require("path");
const fs = require("fs").promises;
const logger = require("../config/logger");

const { Projects, Technology } = require("../models");
const PaginationHelper = require("../utils/paginationHelper");

class ProjectsController {
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
      return true;
    } catch (error) {
      if (error.code !== "ENOENT") {
        logger.error(`Error deleting file ${filePath}: ${error.message}`);
      }
      return false;
    }
  }

  static async getAll(req, res, next) {
    try {
      const { page, limit, offset } = PaginationHelper.getPaginationParams(req);
      const { search, status } = req.query;

      // Build filter
      const filter = {};
      
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (status !== undefined) {
        filter.status = status === 'true';
      }

      // Fetch data with pagination
      const totalItems = await Projects.countDocuments(filter);
      const rows = await Projects.find(filter)
        .sort({ sort_order: 1 })
        .skip(offset)
        .limit(limit)
        .populate('technologies_list', 'name status');

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

      const project = await Projects.findById(id).populate('technologies_list', 'name status');

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const {
        title,
        description,
        media_alt,
        project_link,
        github_link,
        technologies,
        status,
        sort_order,
      } = req.body;

      const media_path = req.files?.media_path?.[0]?.relativePath ?? null;

      // Convert technology input to array of IDs
      let techArray = [];
      if (technologies) {
        techArray = Array.isArray(technologies)
          ? technologies
          : JSON.parse(technologies);
      }

      // Create project
      const newProject = await Projects.create({
        title,
        description,
        media_path,
        media_alt,
        project_link,
        github_link,
        status: status ?? true,
        sort_order: sort_order ?? 0,
        technologies_list: techArray,
      });

      const fullData = await Projects.findById(newProject._id).populate('technologies_list', 'name status');

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: fullData,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;

      const {
        title,
        description,
        media_alt,
        technologies,
        status,
        sort_order,
        project_link,
        github_link,
      } = req.body;

      let project = await Projects.findById(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // FILE HANDLING
      if (req.files?.media_path) {
        const oldFile = project.media_path;
        project.media_path = req.files.media_path[0].relativePath;

        if (oldFile) await ProjectsController.deleteFile(oldFile);
      }

      // Prepare update object
      if (title) project.title = title;
      if (description) project.description = description;
      if (media_alt) project.media_alt = media_alt;
      if (github_link) project.github_link = github_link;
      if (project_link) project.project_link = project_link;
      
      if (status !== undefined) {
         project.status = status === 'true' || status === true;
      }

      if (sort_order !== undefined) {
          project.sort_order = parseInt(sort_order);
      }

      // UPDATE TECHNOLOGIES
      if (technologies) {
        const techArray = Array.isArray(technologies)
          ? technologies
          : JSON.parse(technologies);
        
        project.technologies_list = techArray;
      }
      
      await project.save();

      // Return updated project with technologies
      const updatedData = await Projects.findById(id).populate('technologies_list', 'name status');

      return res.json({
        success: true,
        message: "Project updated successfully",
        data: updatedData,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const project = await Projects.findById(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Remove file if exists
      if (project.media_path) {
        await ProjectsController.deleteFile(project.media_path);
      }

      // Delete project
      await Projects.findByIdAndDelete(id);

      res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectsController;
