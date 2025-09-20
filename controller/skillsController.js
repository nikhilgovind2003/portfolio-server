const model = require("../models/index");

const DataBase = model.Skills

class Skills {
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
            const { skills, status, sort_order } = req.body;

            const existingSkil = await DataBase.findOne({ where: { skills } });

            if (existingSkil) {
                return res.status(400).json({ message: "Skill already exists" });
            }


            const newSkill = await DataBase.create({ skills, status, sort_order });
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

    static async getProjectsBySkill(req, res, next) {
        try {
            const { id } = req.params;
            const skill = await DataBase.findByPk(id);
            
            if (!skill) {
                return res.status(404).json({ message: "Skill not found" });
            }

            const projects = await skill.getProjects({
                order: [["sort_order", "ASC"]],
            });

            res.json({
                skill: {
                    id: skill.id,
                    skills: skill.skills,
                    status: skill.status,
                    sort_order: skill.sort_order
                },
                projects: projects
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
    try {
        const { id } = req.params;
        const data = req.body;

        const skill = await DataBase.findByPk(id);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        // Correctly update with the data object
        await skill.update(data);

        // Fetch the updated record with associations
        const updatedData = await DataBase.findByPk(id, {
            include: [
                {
                    model: require("../models").Projects,
                    as: "projects",
                    through: { attributes: [] },
                },
            ],
        });
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
                message: "Skill deleted successfully" 
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = Skills;