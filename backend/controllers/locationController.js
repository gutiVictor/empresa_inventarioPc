const { Location } = require('../models');

// Obtener todas las ubicaciones
exports.getAll = async (req, res) => {
  try {
    const locations = await Location.findAll({
      where: { deleted_at: null },
      order: [['name', 'ASC']]
    });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener ubicación por ID
exports.getById = async (req, res) => {
  try {
    const location = await Location.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear nueva ubicación
exports.create = async (req, res) => {
  try {
    const location = await Location.create({ 
      ...req.body, 
      created_by: req.user?.id || req.userId 
    });
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar ubicación
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }
    
    await location.update({
      ...req.body,
      updated_by: req.user?.id || req.userId
    });
    
    res.json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar ubicación (soft delete)
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }
    
    await location.update({ 
      deleted_at: new Date(),
      updated_by: req.user?.id || req.userId
    });
    
    res.json({ message: 'Ubicación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
