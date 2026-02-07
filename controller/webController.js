const { Cms, Projects, Skills } = require("../models");

class WebController {
  static async index(req, res, next) {
    try {
      const [cmsData, projectsData, skillsData] =
        await Promise.all([
          Cms.findOne(),
          Projects.find().sort({ sort_order: 1 }).populate('technologies_list', 'name'),
          Skills.find({ status: true }).sort({ sort_order: -1 }),
        ]);

      res.json({
        message: "Web data retrieved successfully",
        data: {
          cms: cmsData || {},
          projects: projectsData || [],
          skills: skillsData || [],
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
      next(error);
    }
  }
}

module.exports = WebController;
