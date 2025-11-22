const models = require('../models');

class DashboardController {
    static async show(req,res,next) {
        try {
            

            // Find counts
            const userCount = await models.User.count();
            const projectCount = await models.Projects.count();
            const techCount = await models.Technology.count();
            const skillCount = await models.Skills.count();
            
            // Send response
            res.json({
                message: "Dashboard data retrieved successfully",
                data: {
                    userCount,
                    projectCount,
                    techCount,
                    skillCount
                }
            });
        } catch (error) {
            next(error)
        }
    }

}


module.exports =  DashboardController