// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  full_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true, // Temporalmente permitimos null para migración
  },
  employee_id: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  job_title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'operator', 'viewer'),
    defaultValue: 'viewer',
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
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
  tableName: 'users',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

// Método para verificar password
User.prototype.validatePassword = async function(password) {
  if (!this.password_hash) return false;
  return bcrypt.compare(password, this.password_hash);
};

// Método estático para hashear password
User.hashPassword = async function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = User;