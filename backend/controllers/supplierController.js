const { Supplier } = require('../models');

// Obtener todos los proveedores
exports.getAll = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      where: { deleted_at: null },
      order: [['name', 'ASC']]
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener proveedor por ID
exports.getById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear nuevo proveedor
exports.create = async (req, res) => {
  try {
    const supplier = await Supplier.create({ 
      ...req.body, 
      created_by: req.user?.id || req.userId 
    });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar proveedor
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    
    await supplier.update({
      ...req.body,
      updated_by: req.user?.id || req.userId
    });
    
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar proveedor (soft delete)
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    
    await supplier.update({ 
      deleted_at: new Date(),
      updated_by: req.user?.id || req.userId
    });
    
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
