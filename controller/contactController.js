const models = require("../models");

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
            const messages = await dataBase.findAll({
                order: [["createdAt", "DESC"]],
            });
            res.json(messages);
        }
        catch (error) {
            next(error);
        }
    }
}

module.exports = ContactController;
