const { Asset, Category, Location, Supplier, User } = require('../models');

// Obtener todos los activos
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { deleted_at: null },
      include: [
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name'],
          required: false
        },
        { 
          model: Location, 
          as: 'location', 
          attributes: ['id', 'name', 'code'],
          required: false
        },
        { 
          model: Supplier, 
          as: 'supplier', 
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Serializar los datos correctamente
    const serializedAssets = assets.map(asset => asset.toJSON());
    
    console.log(`[Assets] Devolviendo ${serializedAssets.length} activos`);
    res.json(serializedAssets);
  } catch (error) {
    console.error('[Assets] Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener un activo por ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      where: { id: req.params.id, deleted_at: null },
      include: [
        { model: Category, as: 'category' },
        { model: Location, as: 'location' },
        { model: Supplier, as: 'supplier' },
        { model: User, as: 'creator', attributes: ['id', 'full_name'] }
      ]
    });
    
    if (!asset) {
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo activo
exports.createAsset = async (req, res) => {
  try {
    const asset = await Asset.create({
      ...req.body,
      created_by: req.userId // Del middleware de autenticación
    });
    
    // Recargar con las relaciones
    const assetWithRelations = await Asset.findByPk(asset.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Location, as: 'location', attributes: ['id', 'name', 'code'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name'] }
      ]
    });
    
    res.status(201).json(assetWithRelations);
  } catch (error) {
    console.error('[Assets] Error creating asset:', error);
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un activo
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!asset) {
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    
    await asset.update({
      ...req.body,
      updated_by: req.userId
    });
    
    // Recargar con las relaciones
    const assetWithRelations = await Asset.findByPk(asset.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Location, as: 'location', attributes: ['id', 'name', 'code'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name'] }
      ]
    });
    
    res.json(assetWithRelations);
  } catch (error) {
    console.error('[Assets] Error updating asset:', error);
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un activo (soft delete)
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!asset) {
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    
    await asset.update({ deleted_at: new Date() });
    
    res.json({ message: 'Activo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
