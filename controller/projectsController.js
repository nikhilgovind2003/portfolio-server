const path = require("path");
const fs = require("fs").promises;
const logger = require("../config/logger");
const {
  Projects,
  Skills,
  Technology,
  ProjectTechnologies,
} = require("../models");
const technology = require("../models/technology");

class ProjectsController {
  static async deleteFile(filePath) {
    if (!filePath) return false;
    try {
      const absolutePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        filePath.replace("/uploads/", "")
      );

      console.log("absolutePath: ", absolutePath);
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
      const projects = await Projects.findAll({
        order: [["sort_order", "ASC"]],
        include: [
          {
            model: Technology,
            as: "technologies",
            attributes: ["name"],
            through: { attributes: [] }
          },
        ],
      });
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const project = await Projects.findByPk(id);

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
        status,
        sort_order,
        technology_ids,
      } = req.body;
      const media_path = req.file?.path ?? null;

      if (!title || !description || !media_alt) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // ✅ Step 1: Create project
      const newProject = await Projects.create({
        title,
        description,
        media_path,
        media_alt,
        status: status ?? true,
        sort_order: sort_order ?? 0,
      });

      // ✅ Step 2: Attach technologies (only if provided)
      if (
        technology_ids &&
        Array.isArray(technology_ids) &&
        technology_ids.length > 0
      ) {
        const validTechnologies = await Technology.findAll({
          where: { id: technology_ids },
        });

        if (validTechnologies.length !== technology_ids.length) {
          return res
            .status(400)
            .json({ message: "Invalid technology IDs provided" });
        }

        // This automatically inserts into `project_technologies`
        await newProject.setTechnologies(technology_ids);
      }

      // ✅ Step 3: Fetch full project with related technologies
      const projectWithTech = await Projects.findByPk(newProject.id, {
        include: [{ model: Technology, as: "technologies" }],
      });

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: projectWithTech,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, media_alt, status, sort_order, skills } =
        req.body;

      const project = await Projects.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Only delete old file if a new file is uploaded
      if (req.file) {
        // Save old path before overwriting
        const oldFilePath = project.media_path;

        // Set new file path
        project.media_path = req.file.path;

        // Delete old file
        if (oldFilePath) {
          await ProjectsController.deleteFile(oldFilePath, res);
        }
      }

      // Update other fields
      const updateData = {
        title: title || project.title,
        description: description || project.description,
        media_alt: media_alt || project.media_alt,
        status:
          status !== undefined
            ? status === "true" || status === true
            : project.status,
        sort_order:
          sort_order !== undefined ? parseInt(sort_order) : project.sort_order,
        media_path: project.media_path,
      };

      await project.update(updateData);

      // Fetch the updated project
      const updatedProject = await Projects.findByPk(id);
      res.json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

  static async addSkillsToProject(req, res, next) {
    try {
      const { id } = req.params;
      const { skillIds } = req.body;

      const project = await Projects.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!Array.isArray(skillIds)) {
        return res.status(400).json({ message: "skillIds must be an array" });
      }

      // Add skills to project
      await project.addSkills(skillIds);

      // Fetch updated project with skills
      const updatedProject = await Projects.findByPk(id, {
        include: [
          {
            model: Skills,
            as: "skills",
            through: { attributes: [] },
          },
        ],
      });

      res.json({
        success: true,
        message: "Skills added to project successfully",
        project: updatedProject,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeSkillsFromProject(req, res, next) {
    try {
      const { id } = req.params;
      const { skillIds } = req.body;

      const project = await Projects.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!Array.isArray(skillIds)) {
        return res.status(400).json({ message: "skillIds must be an array" });
      }

      // Remove skills from project
      await project.removeSkills(skillIds);

      // Fetch updated project with skills
      const updatedProject = await Projects.findByPk(id, {
        include: [
          {
            model: Skills,
            as: "skills",
            through: { attributes: [] },
          },
        ],
      });

      res.json({
        success: true,
        message: "Skills removed from project successfully",
        project: updatedProject,
      });
    } catch (error) {
      next(error);
    }
  }

  static async setProjectSkills(req, res, next) {
    try {
      const { id } = req.params;
      const { skills } = req.body;

      const project = await Projects.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!Array.isArray(skills)) {
        return res.status(400).json({ message: "Skills must be an array" });
      }

      // Set skills for the project (replaces all existing skills)
      await project.setSkills(skills);

      // Fetch updated project with skills
      const updatedProject = await Projects.findByPk(id);

      res.json({
        success: true,
        message: "Skills set for project successfully",
        project: updatedProject,
      });
    } catch (error) {
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

      // Delete associated file
      if (project.media_path) {
        const fs = require("fs");
        const path = require("path");
        const fullPath = path.join(__dirname, "../uploads", project.media_path);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }

      await project.destroy();
      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectsController;
