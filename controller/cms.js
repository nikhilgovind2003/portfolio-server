const models = require('../models')
const Database = models.Cms

class CmsController {
    static async index(req, res) {
        const { Cms } = require('../models');
        try {
            const cmsData = await Database.findAll();
            res.json(cmsData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch CMS data' });
        }
    }

// get by id
    static async show(req, res) {
        const { id } = req.params;
        try {
            const cmsItem = await Database.findByPk(id);
            if (!cmsItem) {
                return res.status(404).json({ error: 'CMS item not found' });
            }
            res.json(cmsItem);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch CMS item' });
        }
    }


    // create
    static async create(req, res) {
        const data = req.body;
        try {
            if(!data) throw new Error("No data provided");
            const newCmsItem = await Database.create({...data});
            res.status(201).json(newCmsItem);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create CMS item' });
        }
    }

    // update
    static async update(req, res) {
        const { id } = req.params;
        const data = req.body;
        try {
            const cmsItem = await Database.findByPk(id);
            if (!cmsItem) {
                return res.status(404).json({ error: 'CMS item not found' });
            }
            const updatedCmsItem = await cmsItem.update({...data});
            res.json(updatedCmsItem);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update CMS item' });
        }
    }


    // delete
    static async delete(req, res) {
        const { id } = req.params;
        try {
            const cmsItem = await Database.findByPk(id);
            if (!cmsItem) {
                return res.status(404).json({ error: 'CMS item not found' });
            }
            await cmsItem.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete CMS item' });
        }
    }
}


module.exports = CmsController;