const path = require("path");
const fs = require("fs").promises;
const logger = require("../config/logger");

const { Projects, Technology } = require("../models");
const PaginationHelper = require("../utils/paginationHelper");
const { Op } = require("sequelize");

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


      
      // Build where clause
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (status !== undefined) {
        whereClause.status = status === "true";
      }

      // Fetch data with pagination
      const { count, rows } = await Projects.findAndCountAll({
        where: whereClause,
        order: [["sort_order", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Technology,
            as: "technologies_list",
            attributes: ["id", "name", "status"],
            through: { attributes: [] },
          },
        ],
      });

      // Format response
      const response = PaginationHelper.formatResponse(rows, count, page, limit);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const project = await Projects.findByPk(id, {
        include: [
          {
            model: Technology,
            as: "technologies_list",
            attributes: ["id", "name", "status"],
            through: { attributes: [] },
          },
        ],
      });

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

      const media_path = req.file?.path ?? null;

      // Convert technology input to array of IDs
      const techArray = technologies
        ? Array.isArray(technologies)
          ? technologies.map(Number)
          : JSON.parse(technologies).map(Number)
        : [];

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
      });

      // Save technologies in pivot table
      // Safe to insert into pivot table
      if (techArray.length > 0) {
        await newProject.setTechnologies_list(techArray);
      }

      const fullData = await Projects.findByPk(newProject.id, {
        include: [
          {
            model: Technology,
            as: "technologies_list",
            attributes: ["id", "name", "status"],
            through: { attributes: [] },
          },
        ],
      });

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

      const project = await Projects.findByPk(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // FILE HANDLING
      if (req.file) {
        const oldFile = project.media_path;
        project.media_path = req.file.path;

        if (oldFile) await ProjectsController.deleteFile(oldFile);
      }

      // Update fields
      await project.update({
        title: title ?? project.title,
        description: description ?? project.description,
        media_alt: media_alt ?? project.media_alt,
        github_link: github_link ?? project.github_link,
        media_path: project.media_path,
        project_link: project_link ?? project.project_link,
        status:
          status !== undefined
            ? status === "true" || status === true
            : project.status,
        sort_order:
          sort_order !== undefined ? parseInt(sort_order) : project.sort_order,
      });

      // UPDATE TECHNOLOGIES (pivot table)
      if (technologies) {
        // Convert input to array of numbers
        const techArray = Array.isArray(technologies)
          ? technologies.map(Number)
          : JSON.parse(technologies).map(Number);

        // Validate IDs exist
        if (techArray.length > 0) {
          const existingTech = await Technology.findAll({
            where: { id: techArray },
            attributes: ["id"],
          });

          const existingIds = existingTech.map((t) => t.id);
          const invalidIds = techArray.filter(
            (id) => !existingIds.includes(id)
          );

          if (invalidIds.length > 0) {
            return res.status(400).json({
              success: false,
              message: `Invalid technology IDs: ${invalidIds.join(", ")}`,
            });
          }
        }

        // Safe to update pivot table
        await project.setTechnologies_list(techArray);
      }

      // Return updated project with technologies
      const updatedData = await Projects.findByPk(id, {
        include: [
          {
            model: Technology,
            as: "technologies_list",
            attributes: ["id", "name", "status"],
            through: { attributes: [] },
          },
        ],
      });

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

      const project = await Projects.findByPk(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Remove file if exists
      if (project.media_path) {
        await ProjectsController.deleteFile(project.media_path);
      }

      // Delete project (auto deletes pivot due to CASCADE)
      await project.destroy();

      res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectsController;
