const { sequelize } = require('./models');
const { DataTypes } = require('sequelize');

async function addMissingColumns() {
  const queryInterface = sequelize.getQueryInterface();
  const table = 'assets';

  try {
    console.log('Adding missing columns to assets table...');

    await queryInterface.addColumn(table, 'warranty_expiry_date', {
      type: DataTypes.DATEONLY,
      allowNull: true
    });
    console.log('Added warranty_expiry_date');

    await queryInterface.addColumn(table, 'invoice_number', {
      type: DataTypes.STRING(50),
      allowNull: true
    });
    console.log('Added invoice_number');

    await queryInterface.addColumn(table, 'purchase_order_number', {
      type: DataTypes.STRING(50),
      allowNull: true
    });
    console.log('Added purchase_order_number');

    await queryInterface.addColumn(table, 'deleted_at', {
      type: DataTypes.DATE,
      allowNull: true
    });
    console.log('Added deleted_at');

    console.log('All columns added successfully.');
  } catch (error) {
    console.error('Error adding columns:', error);
  }
}

addMissingColumns();
