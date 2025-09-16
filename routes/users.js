const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET /api/users - Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [['id', 'ASC']] });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST /api/users - Create a new user
router.post('/', async (req, res, next) => {
  try {
    const created = await User.create({ 
      name: req.body.name, 
      email: req.body.email 
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/:id - Update user by ID
router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.update({
      name: req.body.name,
      email: req.body.email
    });
    
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/:id - Delete user by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

