// backend/models/LicenseAssignment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LicenseAssignment = sequelize.define('LicenseAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assigned_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  license_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'software_licenses',
      key: 'id',
    },
  },
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'assets',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'license_assignments',
  timestamps: true,
  underscored: true,
  validate: {
    chkLicenseTarget() {
      if ((this.asset_id === null) === (this.user_id === null)) {
        throw new Error('Debe asignarse a un activo O a un usuario, pero no ambos ni ninguno.');
      }
    },
  },
});

module.exports = LicenseAssignment;