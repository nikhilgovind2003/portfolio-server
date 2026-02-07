const { User, Projects, Technology, Skills } = require('../models');

class DashboardController {
    static async show(req,res,next) {
        try {
            // Find counts
            const userCount = await User.countDocuments();
            const projectCount = await Projects.countDocuments();
            const techCount = await Technology.countDocuments();
            const skillCount = await Skills.countDocuments();
            
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