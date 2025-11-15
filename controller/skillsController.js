const model = require("../models/index");
const path = require("path");
const fs = require("fs").promises;
const DataBase = model.Skills;

class Skills {
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
      const skills = await DataBase.findAll();
      res.json(skills);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const dataModel = req.body;
      const media_path = req.file?.path ?? null;

      const existingSkil = await DataBase.findOne({
        where: { skills: dataModel.skills },
      });

      if (existingSkil) {
        return res.status(400).json({ message: "Skill already exists" });
      }

      const newSkill = await DataBase.create({ ...dataModel, media_path });
      res.status(201).json(newSkill);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const skill = await DataBase.findByPk(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      res.json(skill);
    } catch (error) {
      next(error);
    }
  }

  // static async getProjectsBySkill(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const skill = await DataBase.findByPk(id);

  //     if (!skill) {
  //       return res.status(404).json({ message: "Skill not found" });
  //     }

  //     const projects = await skill.getProjects({
  //       order: [["sort_order", "ASC"]],
  //     });

  //     res.json({
  //       skill: {
  //         id: skill.id,
  //         skills: skill.skills,
  //         status: skill.status,
  //         sort_order: skill.sort_order,
  //       },
  //       projects: projects,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      const skill = await DataBase.findByPk(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      if (req.file) {
        // Save old path before overwriting
        const oldFilePath = skill.media_path;

        // Set new file path
        skill.media_path = req.file.path;

        // Delete old file
        if (oldFilePath) {
          await Skills.deleteFile(oldFilePath, res);
        }
      }
      // Correctly update with the data object
      await skill.update({
        ...data,
        media_path: skill.media_path,
      });

      // Fetch the updated record with associations
      const updatedData = await DataBase.findByPk(id);
      res.json(updatedData);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const skill = await DataBase.findByPk(id);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      await skill.destroy();
      res.status(200).json({
        success: true,
        message: "Skill deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Skills;
