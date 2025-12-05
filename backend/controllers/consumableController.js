const { Consumable, Category, Location } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const consumables = await Consumable.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Location, as: 'location', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(consumables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const consumable = await Consumable.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Location, as: 'location' }
      ]
    });
    if (!consumable) return res.status(404).json({ message: 'Consumible no encontrado' });
    res.json(consumable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const consumable = await Consumable.create({ ...req.body, created_by: req.userId });
    res.status(201).json(consumable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const consumable = await Consumable.findByPk(req.params.id);
    if (!consumable) return res.status(404).json({ message: 'Consumible no encontrado' });
    
    await consumable.update(req.body);
    res.json(consumable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const consumable = await Consumable.findByPk(req.params.id);
    if (!consumable) return res.status(404).json({ message: 'Consumible no encontrado' });
    
    await consumable.destroy();
    res.json({ message: 'Consumible eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;
    
    const consumable = await Consumable.findByPk(id);
    if (!consumable) return res.status(404).json({ message: 'Consumible no encontrado' });
    
    let newStock = consumable.quantity_in_stock;
    if (operation === 'add') newStock += parseInt(quantity);
    else if (operation === 'subtract') newStock -= parseInt(quantity);
    
    if (newStock < 0) return res.status(400).json({ message: 'Stock insuficiente' });
    
    await consumable.update({ quantity_in_stock: newStock });
    res.json(consumable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
