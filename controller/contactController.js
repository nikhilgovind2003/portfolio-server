const { Op } = require("sequelize");
const models = require("../models");
const PaginationHelper = require("../utils/paginationHelper");

const dataBase = models.Contact;

class ContactController {
  static async create(req, res, next) {
    try {
      const { recaptchaToken, ...formData } = req.body;
      const secret = process.env.RECAPTCHA_SECRET_KEY;

      const verifyResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: secret,
            response: recaptchaToken,
          },
        }
      );
      if (!verifyResponse.data.success) {
        return res.status(400).json({
          success: false,
          error: "reCAPTCHA verification failed",
        });
      }

      const newMessage = await dataBase.create({ ...formData });

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
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
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
      const response = PaginationHelper.formatResponse(
        rows,
        count,
        page,
        limit
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContactController;
