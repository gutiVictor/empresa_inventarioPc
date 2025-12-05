const { Document } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const docs = await Document.findAll({
      order: [['uploaded_at', 'DESC']]
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const docs = await Document.findAll({
      where: { entity_type: entityType, entity_id: entityId }
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const doc = await Document.create({ ...req.body, uploaded_by: req.userId, created_by: req.userId });
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });
    
    await doc.update(req.body);
    res.json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });
    
    await doc.destroy();
    res.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
