const models = require("../models");

class WebController {
  static async index(req, res, next) {
    try {
      const [cmsData = [], projectsData = [], skillsData = []] =
        await Promise.all([
          models.Cms.findOne(),
          models.Projects.findAll({ order: [["sort_order", "ASC"]] }),
          models.Skills.findAll({ order: [["sort_order", "ASC"]] }),
        ]);

      res.json({
        message: "Web data retrieved successfully",
        data: {
          cms: cmsData,
          projects: projectsData,
          skills: skillsData,
        },
      });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching data." });
        next(error);
    }
  }
}



module.exports = WebController;