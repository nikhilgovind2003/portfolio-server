const { Experience } = require("../models/index");
const path = require("path");
const PaginationHelper = require("../utils/paginationHelper");
const fs = require("fs").promises;
const logger = require("../config/logger");
const { deleteFromCloudinary, getPublicIdFromUrl, uploadToCloudinary } = require("../utils/cloudinary");

class ExperienceController {
  static async deleteFile(filePath) {
    if (!filePath) return false;
    try {
      // Check if it's a Cloudinary URL
      if (filePath.includes("cloudinary.com")) {
        const publicId = getPublicIdFromUrl(filePath);
        if (publicId) {
          await deleteFromCloudinary(publicId);
          return true;
        }
      }

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
        logger.error(`Failed to delete file ${filePath}: ${error.message}`);
      }
      return false;
    }
  }

  static async getAll(req, res, next) {
    try {
      const { page, limit, offset } = PaginationHelper.getPaginationParams(req);
      const { search, status } = req.query;

      const filter = {};

      if (search) {
        filter.$or = [
          { company: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } }
        ];
      }

      if (status !== undefined) {
        filter.status = status === 'true';
      }

      const totalItems = await Experience.countDocuments(filter);
      const rows = await Experience.find(filter)
        .sort({ sort_order: 1, start_date: -1 })
        .skip(offset)
        .limit(limit);

      const response = PaginationHelper.formatResponse(rows, totalItems, page, limit);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const dataModel = req.body;

      let media_path = null;
      if (req.files?.media_path?.[0]) {
        const localPath = req.files?.media_path?.[0]?.path ?? null;
        const result = await uploadToCloudinary(localPath, 'experience');
        media_path = result.secure_url;

        console.log("result", media_path);
      }

      if (dataModel.status !== undefined) dataModel.status = dataModel.status === 'true' || dataModel.status === true;
      if (dataModel.is_current !== undefined) dataModel.is_current = dataModel.is_current === 'true' || dataModel.is_current === true;
      if (dataModel.sort_order !== undefined) dataModel.sort_order = parseInt(dataModel.sort_order);

      const newExperience = await Experience.create({ ...dataModel, media_path });
      res.status(201).json(newExperience);
    } catch (error) {
      next(error);
      console.log("error data", error);

    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const experience = await Experience.findById(id);

      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      res.json(experience);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      let experience = await Experience.findById(id);

      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      if (req.files && req.files.media_path) {
        const oldFilePath = experience.media_path;
        const localPath = req.files.media_path[0].relativePath;
        const result = await uploadToCloudinary(localPath, 'experience');
        experience.media_path = result.secure_url;


        if (oldFilePath) {
          await ExperienceController.deleteFile(oldFilePath);
        }
      }

      if (data.company) experience.company = data.company;
      if (data.role) experience.role = data.role;
      if (data.location) experience.location = data.location;
      if (data.start_date) experience.start_date = data.start_date;
      if (data.end_date) experience.end_date = data.end_date;
      if (data.is_current !== undefined) experience.is_current = data.is_current === 'true' || data.is_current === true;
      if (data.description) experience.description = data.description;
      if (data.media_alt) experience.media_alt = data.media_alt;
      if (data.status !== undefined) experience.status = data.status === 'true' || data.status === true;
      if (data.sort_order !== undefined) experience.sort_order = parseInt(data.sort_order);

      await experience.save();
      res.json(experience);
    } catch (error) {
      console.log("error data", error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const experience = await Experience.findById(id);
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      if (experience.media_path) {
        await ExperienceController.deleteFile(experience.media_path);
      }

      await Experience.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Experience deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExperienceController;
