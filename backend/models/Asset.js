// backend/models/Asset.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_tag: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  serial_number: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  acquisition_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  acquisition_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  useful_life_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
  },
  residual_value: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.ENUM('active', 'stored', 'disposed', 'stolen', 'under_repair'),
    allowNull: false,
  },
  condition: {
    type: DataTypes.ENUM('new', 'good', 'fair', 'poor', 'broken'),
    allowNull: false,
  },
  warranty_expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  invoice_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  purchase_order_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  specs: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  location_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'locations',
      key: 'id',
    },
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
  tableName: 'assets',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

module.exports = Asset;