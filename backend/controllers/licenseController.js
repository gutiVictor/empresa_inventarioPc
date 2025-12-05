const { SoftwareLicense, LicenseAssignment, Supplier, Asset, User } = require('../models');

// --- LICENCIAS ---
exports.getAllLicenses = async (req, res) => {
  try {
    const licenses = await SoftwareLicense.findAll({
      include: [{ 
        model: Supplier, 
        as: 'supplier', 
        attributes: ['id', 'name'],
        required: false // LEFT JOIN para incluir licencias sin proveedor
      }],
      order: [['created_at', 'DESC']]
    });
    
    // Serializar los datos correctamente
    const serializedLicenses = licenses.map(license => {
      const data = license.toJSON();
      return data;
    });
    
    console.log(`[Licenses] Devolviendo ${serializedLicenses.length} licencias`);
    res.json(serializedLicenses);
  } catch (error) {
    console.error('[Licenses] Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getLicenseById = async (req, res) => {
  try {
    const license = await SoftwareLicense.findByPk(req.params.id, {
      include: [{ model: Supplier, as: 'supplier' }]
    });
    if (!license) return res.status(404).json({ message: 'Licencia no encontrada' });
    res.json(license);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLicense = async (req, res) => {
  try {
    const license = await SoftwareLicense.create({ ...req.body, created_by: req.userId });
    res.status(201).json(license);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLicense = async (req, res) => {
  try {
    const license = await SoftwareLicense.findByPk(req.params.id);
    if (!license) return res.status(404).json({ message: 'Licencia no encontrada' });
    
    await license.update(req.body);
    res.json(license);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLicense = async (req, res) => {
  try {
    const license = await SoftwareLicense.findByPk(req.params.id);
    if (!license) return res.status(404).json({ message: 'Licencia no encontrada' });
    
    await license.destroy();
    res.json({ message: 'Licencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ASIGNACIONES DE LICENCIAS ---
exports.assignLicense = async (req, res) => {
  try {
    const { license_id } = req.body;
    const license = await SoftwareLicense.findByPk(license_id);
    
    if (!license) return res.status(404).json({ message: 'Licencia no encontrada' });
    
    if (license.seats_used >= license.seats_total) {
      return res.status(400).json({ message: 'No hay asientos disponibles para esta licencia' });
    }

    const assignment = await LicenseAssignment.create({ ...req.body, created_by: req.userId });
    await license.increment('seats_used');
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await LicenseAssignment.findAll({
      include: [
        { model: SoftwareLicense, as: 'license' },
        { model: Asset, as: 'asset', attributes: ['asset_tag', 'name'] },
        { model: User, as: 'user', attributes: ['full_name'] }
      ]
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
