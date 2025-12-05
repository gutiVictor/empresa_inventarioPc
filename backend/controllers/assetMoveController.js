const { AssetMove, Asset, Location, User } = require('../models');

exports.getAllMoves = async (req, res) => {
  try {
    const moves = await AssetMove.findAll({
      where: { deleted_at: null },
      include: [
        { model: Asset, as: 'asset', attributes: ['id', 'asset_tag', 'name'] },
        { model: Location, as: 'fromLocation', attributes: ['id', 'name', 'code'] },
        { model: Location, as: 'toLocation', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'mover', attributes: ['id', 'full_name'] }
      ],
      order: [['move_date', 'DESC']]
    });
    res.json(moves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMoveById = async (req, res) => {
  try {
    const move = await AssetMove.findOne({
      where: { id: req.params.id, deleted_at: null },
      include: [
        { model: Asset, as: 'asset' },
        { model: Location, as: 'fromLocation' },
        { model: Location, as: 'toLocation' },
        { model: User, as: 'mover' }
      ]
    });
    if (!move) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json(move);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMove = async (req, res) => {
  try {
    const move = await AssetMove.create({
      ...req.body,
      moved_by: req.user?.id || req.userId,
      created_by: req.user?.id || req.userId
    });

    // Actualizar la ubicación del activo
    if (req.body.to_location_id) {
      await Asset.update(
        { location_id: req.body.to_location_id },
        { where: { id: req.body.asset_id } }
      );
    }

    res.status(201).json(move);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateMove = async (req, res) => {
  try {
    const move = await AssetMove.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!move) return res.status(404).json({ message: 'Movimiento no encontrado' });
    
    await move.update(req.body);
    
    // Actualizar la ubicación del activo si cambió
    if (req.body.to_location_id) {
      await Asset.update(
        { location_id: req.body.to_location_id },
        { where: { id: move.asset_id } }
      );
    }
    
    res.json(move);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMove = async (req, res) => {
  try {
    const move = await AssetMove.findOne({
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!move) return res.status(404).json({ message: 'Movimiento no encontrado' });
    
    await move.update({ deleted_at: new Date() });
    res.json({ message: 'Movimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
