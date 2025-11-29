const models = require("../models");

class WebController {
  static async index(req, res, next) {
    try {
      const [cmsData = [], projectsData = [], skillsData = []] =
        await Promise.all([
          models.Cms.findOne(),
          models.Projects.findAll({
            order: [["sort_order", "ASC"]],
            include: [
              {
                model: models.Technology,
                as: "technologies_list",
                attributes: ["name"],
                through: { attributes: [] },
              },
            ],
          }),
          models.Skills.findAll({
            order: [["sort_order", "DESC"]],
            where: { status: true },
          }),
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
      res.status(500).json({ error: error.message });
      next(error);
    }
  }
}

module.exports = WebController;
