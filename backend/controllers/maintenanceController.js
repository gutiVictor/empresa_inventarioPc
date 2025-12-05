const { MaintenanceOrder, Asset, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const orders = await MaintenanceOrder.findAll({
      where: { deleted_at: null },
      include: [
        { model: Asset, as: 'asset', attributes: ['id', 'asset_tag', 'name'] },
        { model: User, as: 'technician', attributes: ['id', 'full_name'] }
      ],
      order: [['planned_date', 'ASC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await MaintenanceOrder.findOne({
      where: { id: req.params.id, deleted_at: null },
      include: [
        { model: Asset, as: 'asset', attributes: ['id', 'asset_tag', 'name'] },
        { model: User, as: 'technician', attributes: ['id', 'full_name'] }
      ]
    });
    
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const order = await MaintenanceOrder.create({
      ...req.body,
      created_by: req.user?.id || req.userId
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const order = await MaintenanceOrder.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    
    await order.update({
      ...req.body,
      updated_by: req.user?.id || req.userId
    });
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const order = await MaintenanceOrder.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    
    await order.update({ 
      deleted_at: new Date(),
      updated_by: req.user?.id || req.userId 
    });
    
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
