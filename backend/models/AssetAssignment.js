// backend/models/AssetAssignment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AssetAssignment = sequelize.define('AssetAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assigned_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  expected_return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isAfterOrEqual(value) {
        if (value && this.assigned_date && value < this.assigned_date) {
          throw new Error('expected_return_date debe ser igual o posterior a assigned_date');
        }
      },
    },
  },
  return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'returned'),
    defaultValue: 'active',
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
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assets',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  tableName: 'asset_assignments',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

module.exports = AssetAssignment;