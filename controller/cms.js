const models = require("../models");

const dataBase = models.Cms

class CmsController {
  static async index(req, res, next) {
    try {


      const [
        cms = [],
        project = [],
        skills = [],
      ] = await Promise.all([
        dataBase.findAll(),
        models.Projects.findAll({ order: [['sort_order', 'ASC']] }),
        models.Skills.findAll({ order: [['sort_order', 'ASC']] })
      ])


      const cmsData = {
        cms, project, skills
      }

      res.status(200).json(cmsData);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const cmsItem = await dataBase.findOne();
      if (!cmsItem) return res.status(404).json({ error: "CMS item not found" });

      // Replace old file if new uploaded
      const newFilePath = req.replaceFile(cmsItem.media_path, req);

      // Update fields dynamically
      const updateFields = [
        'super_title', 'title', 'description', 'btn_one_text', 'btn_one_link',
        'btn_two_text', 'btn_two_link', 'media_alt', 'project_title',
        'skills_title', 'about_title', 'about_description', 'contact_title'
      ];

      updateFields.forEach(field => {
        if (req.body[field] !== undefined) {
          cmsItem[field] = req.body[field];
        }
      });

      cmsItem.media_path = newFilePath;

      await cmsItem.save();
      res.json(cmsItem);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CmsController;
