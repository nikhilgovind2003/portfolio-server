const models = require("../models");
const PaginationHelper = require("../utils/paginationHelper");

const dataBase = models.Contact;

class ContactController {
  static async create(req, res, next) {
    try {
      const data = { ...req.body };

        console.log(data)
      const newMessage = await dataBase.create({ ...data });

        res.status(201).json({
          message: "Message sent successfully",
          data: newMessage,
      });
    } catch (err) {
      next(err);
    }
    }
    
   static async index(req, res, next) {
    try {
      const { page, limit, offset } = PaginationHelper.getPaginationParams(req);
      const { search, status } = req.query;

      // Build where clause
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      if (status !== undefined) {
        whereClause.status = status === "true";
      }

      // Fetch data with pagination
      const { count, rows } = await dataBase.findAndCountAll({
        where: whereClause,
        limit,
        offset,
      });

      // Format response
      const response = PaginationHelper.formatResponse(rows, count, page, limit);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContactController;
