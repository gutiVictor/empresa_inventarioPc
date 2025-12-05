// backend/models/index.js
const sequelize = require('../config/database');

// Importar modelos
const User               = require('./User');
const Location           = require('./Location');
const Category           = require('./Category');
const Supplier           = require('./Supplier');
const Asset              = require('./Asset');
const SoftwareLicense    = require('./SoftwareLicense');
const Consumable         = require('./Consumable');
const Document           = require('./Document');
const AuditLog           = require('./AuditLog');
const AssetMove          = require('./AssetMove');
const MaintenanceOrder   = require('./MaintenanceOrder');
const AssetAssignment    = require('./AssetAssignment');
const LicenseAssignment  = require('./LicenseAssignment');

/* ----------------------------------------------------------
   RELACIONES CORE (ya las tenías)
---------------------------------------------------------- */

// Asset
Asset.belongsTo(Category,      { foreignKey: 'category_id', as: 'category' });
Asset.belongsTo(Location,      { foreignKey: 'location_id', as: 'location' });
Asset.belongsTo(Supplier,      { foreignKey: 'supplier_id', as: 'supplier' });
Asset.belongsTo(User,          { foreignKey: 'created_by',  as: 'creator' });

// Category árbol
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

// SoftwareLicense
SoftwareLicense.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

// Consumable
Consumable.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Consumable.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });

// AuditLog
AuditLog.belongsTo(User, { foreignKey: 'changed_by', as: 'user' });

// AssetMove
AssetMove.belongsTo(Asset,    { foreignKey: 'asset_id',        as: 'asset' });
AssetMove.belongsTo(Location, { foreignKey: 'from_location_id', as: 'fromLocation' });
AssetMove.belongsTo(Location, { foreignKey: 'to_location_id',   as: 'toLocation' });
AssetMove.belongsTo(User,     { foreignKey: 'moved_by',        as: 'mover' });

// MaintenanceOrder
MaintenanceOrder.belongsTo(Asset, { foreignKey: 'asset_id',       as: 'asset' });
MaintenanceOrder.belongsTo(User,  { foreignKey: 'technician_id',  as: 'technician' });

// AssetAssignment
AssetAssignment.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });
AssetAssignment.belongsTo(User,  { foreignKey: 'user_id',  as: 'user' });

// LicenseAssignment
LicenseAssignment.belongsTo(SoftwareLicense, { foreignKey: 'license_id', as: 'license' });
LicenseAssignment.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });
LicenseAssignment.belongsTo(User,  { foreignKey: 'user_id',  as: 'user' });

// Relaciones inversas rápidas
Asset.hasMany(MaintenanceOrder,  { foreignKey: 'asset_id', as: 'maintenances' });
Asset.hasMany(AssetAssignment,   { foreignKey: 'asset_id', as: 'assignments' });
User.hasMany(AssetAssignment,    { foreignKey: 'user_id',  as: 'assignedAssets' });

/* ----------------------------------------------------------
   RELACIONES DE AUDITORÍA FALTANTES
---------------------------------------------------------- */
Asset.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

Category.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Category.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

Consumable.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Consumable.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

Document.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
Document.belongsTo(User, { foreignKey: 'created_by',  as: 'creator' });

AssetMove.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

MaintenanceOrder.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
MaintenanceOrder.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

AssetAssignment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
AssetAssignment.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

LicenseAssignment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Supplier.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Supplier.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

Location.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Location.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

/* ----------------------------------------------------------
   RELACIONES INVERSAS ÚTILES (TAMBIÉN FALTABAN)
---------------------------------------------------------- */
User.hasMany(Asset,              { foreignKey: 'created_by', as: 'createdAssets' });
User.hasMany(Asset,              { foreignKey: 'updated_by', as: 'updatedAssets' });
User.hasMany(AssetMove,          { foreignKey: 'created_by', as: 'createdAssetMoves' });
User.hasMany(MaintenanceOrder,   { foreignKey: 'technician_id', as: 'technicianOrders' });
User.hasMany(MaintenanceOrder,   { foreignKey: 'created_by',    as: 'createdMaintenances' });
User.hasMany(Document,           { foreignKey: 'uploaded_by',   as: 'uploadedDocuments' });
User.hasMany(Document,           { foreignKey: 'created_by',    as: 'createdDocuments' });
User.hasMany(Category,           { foreignKey: 'created_by',    as: 'createdCategories' });
User.hasMany(Category,           { foreignKey: 'updated_by',    as: 'updatedCategories' });
User.hasMany(Consumable,         { foreignKey: 'created_by',    as: 'createdConsumables' });
User.hasMany(Consumable,         { foreignKey: 'updated_by',    as: 'updatedConsumables' });
User.hasMany(Supplier,           { foreignKey: 'created_by',    as: 'createdSuppliers' });
User.hasMany(Supplier,           { foreignKey: 'updated_by',    as: 'updatedSuppliers' });
User.hasMany(Location,           { foreignKey: 'created_by',    as: 'createdLocations' });
User.hasMany(Location,           { foreignKey: 'updated_by',    as: 'updatedLocations' });

/* ----------------------------------------------------------
   EXPORTACIÓN FINAL
---------------------------------------------------------- */
module.exports = {
  sequelize,
  User,
  Location,
  Category,
  Supplier,
  Asset,
  SoftwareLicense,
  Consumable,
  Document,
  AuditLog,
  AssetMove,
  MaintenanceOrder,
  AssetAssignment,
  LicenseAssignment
};