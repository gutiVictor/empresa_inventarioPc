const { sequelize } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const [assetsCount] = await sequelize.query('SELECT COUNT(*) FROM assets WHERE deleted_at IS NULL');
    const [usersCount] = await sequelize.query('SELECT COUNT(*) FROM users WHERE deleted_at IS NULL');
    const [licensesCount] = await sequelize.query('SELECT COUNT(*) FROM software_licenses');
    const [lowStock] = await sequelize.query('SELECT COUNT(*) FROM consumables WHERE quantity_in_stock <= min_quantity');
    
    res.json({
      assets: assetsCount[0].count,
      users: usersCount[0].count,
      licenses: licensesCount[0].count,
      lowStock: lowStock[0].count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpiringLicenses = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT * FROM software_licenses 
      WHERE expiration_date BETWEEN NOW() AND (NOW() + INTERVAL '60 days')
      ORDER BY expiration_date ASC
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowStockConsumables = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT * FROM consumables 
      WHERE quantity_in_stock <= min_quantity
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
