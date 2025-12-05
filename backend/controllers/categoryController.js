const { Category } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { deleted_at: null },
      include: [
        { 
          model: Category, 
          as: 'parent', 
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        { 
          model: Category, 
          as: 'parent', 
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });
    if (!category || category.deleted_at) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const category = await Category.create({ 
      ...req.body, 
      created_by: req.userId 
    });
    
    // Recargar con la relación parent
    const categoryWithParent = await Category.findByPk(category.id, {
      include: [
        { 
          model: Category, 
          as: 'parent', 
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });
    
    res.status(201).json(categoryWithParent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category || category.deleted_at) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    await category.update({
      ...req.body,
      updated_by: req.userId
    });
    
    // Recargar con la relación parent
    const categoryWithParent = await Category.findByPk(category.id, {
      include: [
        { 
          model: Category, 
          as: 'parent', 
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });
    
    res.json(categoryWithParent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category || category.deleted_at) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    await category.update({ 
      deleted_at: new Date(),
      updated_by: req.userId
    });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
