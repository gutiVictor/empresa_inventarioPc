const { sequelize } = require('./models');
const { DataTypes } = require('sequelize');

async function addDeletedAtToUsers() {
  const queryInterface = sequelize.getQueryInterface();
  const table = 'users';

  try {
    console.log('Adding deleted_at to users table...');

    await queryInterface.addColumn(table, 'deleted_at', {
      type: DataTypes.DATE,
      allowNull: true
    });
    console.log('Added deleted_at');

    console.log('Column added successfully.');
  } catch (error) {
    console.error('Error adding column:', error);
  }
}

addDeletedAtToUsers();
