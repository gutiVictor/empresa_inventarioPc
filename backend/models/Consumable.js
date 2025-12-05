// backend/models/Consumable.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consumable = sequelize.define('Consumable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  quantity_in_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  min_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    allowNull: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // ✅ corregido
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  location_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // ✅ corregido
    references: {
      model: 'locations',
      key: 'id',
    },
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true, // ✅ corregido
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
  tableName: 'consumables',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

module.exports = Consumable;