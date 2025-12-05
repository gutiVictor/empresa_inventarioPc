const { AssetAssignment, Asset, User } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const assignments = await AssetAssignment.findAll({
      where: { deleted_at: null },
      include: [
        { model: Asset, as: 'asset', attributes: ['id', 'asset_tag', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'full_name', 'department'] }
      ],
      order: [['assigned_date', 'DESC']]
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Verificar si el activo ya está asignado
    const existing = await AssetAssignment.findOne({
      where: {
        asset_id: req.body.asset_id,
        status: 'active',
        deleted_at: null
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'El activo ya se encuentra asignado actualmente' });
    }

    const assignment = await AssetAssignment.create({
      ...req.body,
      created_by: req.user?.id || req.userId
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.returnAsset = async (req, res) => {
  try {
    const assignment = await AssetAssignment.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!assignment) return res.status(404).json({ message: 'Asignación no encontrada' });
    
    await assignment.update({
      status: 'returned',
      return_date: new Date(),
      notes: req.body.notes || assignment.notes,
      updated_by: req.user?.id || req.userId
    });
    
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await AssetAssignment.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!assignment) return res.status(404).json({ message: 'Asignación no encontrada' });
    
    await assignment.update({ 
      deleted_at: new Date(),
      updated_by: req.user?.id || req.userId
    });
    
    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
