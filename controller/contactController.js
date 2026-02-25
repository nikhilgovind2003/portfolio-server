const { Contact } = require("../models");
const PaginationHelper = require("../utils/paginationHelper");
const axios = require('axios'); // Assuming axios is used but wasn't updated in previous file viewing? It was used in snippet but not imported? Added it to be safe if it's there. Actually line 13 calls axios.

class ContactController {
  static async create(req, res, next) {
    try {
      const { formData } = req.body;


      const newMessage = await Contact.create(formData);

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
      const { search } = req.query;

      // Build filter
      const filter = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const totalItems = await Contact.countDocuments(filter);
      const rows = await Contact.find(filter)
        .skip(offset)
        .limit(limit);

      // Format response
      const response = PaginationHelper.formatResponse(
        rows,
        totalItems,
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
