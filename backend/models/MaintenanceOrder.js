// backend/models/MaintenanceOrder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MaintenanceOrder = sequelize.define('MaintenanceOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM('preventive', 'corrective', 'upgrade'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
    allowNull: false,
  },
  planned_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cost_parts: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  },
  cost_labor: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  },
  technician_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
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
  tableName: 'maintenance_orders',
  timestamps: true,
  underscored: true,
  paranoid: true,
  validate: {
    chkEndAfterStart() {
      if (this.start_date && this.end_date && this.end_date < this.start_date) {
        throw new Error('end_date debe ser igual o posterior a start_date');
      }
    },
    chkPlannedDateLogic() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const planned = new Date(this.planned_date);
      if (this.status !== 'completed' && planned < today) {
        throw new Error('planned_date no puede ser pasada si el estado no es "completed"');
      }
    },
  },
});

module.exports = MaintenanceOrder;