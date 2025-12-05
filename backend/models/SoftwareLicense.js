// backend/models/SoftwareLicense.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SoftwareLicense = sequelize.define('SoftwareLicense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('volume', 'single', 'subscription', 'free'),
    allowNull: false,
  },
  seats_total: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  seats_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  expiration_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'suppliers',
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
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'software_licenses',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

module.exports = SoftwareLicense;