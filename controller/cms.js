const { Cms } = require("../models");
const { uploadToCloudinary } = require("../utils/cloudinary");

class CmsController {
  static async index(req, res, next) {
    try {
      const cmsData = await Cms.findOne();
      if (!cmsData)
        return res.status(404).json({ error: "CMS data not found" });

      return res.json({
        message: "CMS data retrieved successfully",
        data: cmsData,
      });
    } catch (err) {
      next(err);
    }
  }

  static async store(req, res, next) {
    {
      try {
        // Access files from req.files object
        const mediaFiles = req.files?.media_path || [];
        const resumeFiles = req.files?.resume || [];
        const newFilePath =
          mediaFiles.length > 0 ? mediaFiles[0].path : null;
        const resumePath =
          resumeFiles.length > 0 ? resumeFiles[0].path : null;
        const cmsItem = await Cms.create({
          super_title: req.body.super_title,
          title: req.body.title,
          description: req.body.description,
          btn_one_text: req.body.btn_one_text,
          btn_one_link: req.body.btn_one_link,
          btn_two_text: req.body.btn_two_text,
          media_path: newFilePath,
          media_alt: req.body.media_alt,
          project_title: req.body.project_title,
          skills_title: req.body.skills_title,
          about_title: req.body.about_title,
          about_description: req.body.about_description,
          contact_title: req.body.contact_title,
          experience_title: req.body.experience_title,
          resume: resumePath,
        });
        res.status(201).json(cmsItem);
      } catch (err) {
        next(err);
      }
    }
  }

  static async update(req, res, next) {
    try {
      let cmsItem = await Cms.findOne();
      if (!cmsItem)
        return res.status(404).json({ error: "CMS item not found" });

      // Access files from req.files object
      const mediaFiles = req.files?.media_path || [];
      const resumeFiles = req.files?.resume || [];

      // Get the first media file path (or keep existing)
      const newFilePath =
        mediaFiles.length > 0 ? mediaFiles[0].path : cmsItem.media_path;

      const profilePhoto = await uploadToCloudinary(newFilePath, 'cms');
      // Get the resume file path (or keep existing)
      const resumePath =
        resumeFiles.length > 0 ? resumeFiles[0].relativePath : cmsItem.resume;

      // Update fields dynamically
      const updateFields = [
        "super_title",
        "title",
        "description",
        "btn_one_text",
        "btn_one_link",
        "btn_two_text",
        "media_alt",
        "project_title",
        "skills_title",
        "about_title",
        "about_description",
        "contact_title",
        "experience_title",
      ];

      updateFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          cmsItem[field] = req.body[field];
        }
      });

      cmsItem.media_path = profilePhoto.secure_url;
      cmsItem.resume = resumePath;

      await cmsItem.save();
      res.json(cmsItem);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CmsController;
