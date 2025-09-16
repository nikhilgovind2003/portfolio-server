const express = require('express');
const router = express.Router();
const { Skills } = require('../models');

// GET /api/skills - Get all skills
router.get('/', async (req, res, next) => {
  try {
    const skills = await Skills.findAll({ order: [['sort_order', 'ASC']] });
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// POST /api/skills - Create a new skill
router.post('/', async (req, res, next) => {
  try {
    const created = await Skills.create({
      skills: req.body.skills,
      status: req.body.status !== undefined ? req.body.status : true,
      sort_order: req.body.sort_order || 0
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/skills/:id - Get skill by ID
router.get('/:id', async (req, res, next) => {
  try {
    const skill = await Skills.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

// PUT /api/skills/:id - Update skill by ID
router.put('/:id', async (req, res, next) => {
  try {
    const skill = await Skills.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    await skill.update({
      skills: req.body.skills,
      status: req.body.status,
      sort_order: req.body.sort_order
    });
    
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/skills/:id - Delete skill by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const skill = await Skills.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    await skill.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/skills/:id/projects - Get projects that use this skill
router.get('/:id/projects', async (req, res, next) => {
  try {
    const skill = await Skills.findByPk(req.params.id, {
      include: [{
        model: require('../models').Project,
        as: 'projects',
        through: { attributes: [] }
      }]
    });
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json(skill.projects);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

