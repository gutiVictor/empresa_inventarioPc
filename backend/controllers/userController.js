// backend/controllers/userController.js
const User = require('../models/User');

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { deleted_at: null } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { id: req.params.id, deleted_at: null } 
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      created_by: req.user?.id || req.userId,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    await user.update({ 
      ...req.body, 
      updated_by: req.user?.id || req.userId 
    });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    await user.update({ 
      deleted_at: new Date(), 
      updated_by: req.user?.id || req.userId 
    });
    
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};