/**
 * Script de migración para agregar columnas faltantes
 * identificadas por la suite de pruebas
 * 
 * Ejecutar: node migrations/fix_missing_columns.js
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  }
);

async function migrate() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida\n');

    // 1. Agregar updated_at a asset_moves
    console.log('📝 Agregando updated_at a asset_moves...');
    try {
      await sequelize.query(`
        ALTER TABLE asset_moves 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      console.log('✅ Columna updated_at agregada a asset_moves\n');
    } catch (err) {
      console.log('ℹ️  updated_at ya existe en asset_moves\n');
    }

    // 2. Agregar columnas a software_licenses
    console.log('📝 Agregando columnas a software_licenses...');
    try {
      await sequelize.query(`
        ALTER TABLE software_licenses 
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id)
      `);
      console.log('✅ Columnas agregadas a software_licenses\n');
    } catch (err) {
      console.log('ℹ️  Columnas ya existen en software_licenses\n');
    }

    // 3. Agregar deleted_at a consumables
    console.log('📝 Agregando deleted_at a consumables...');
    try {
      await sequelize.query(`
        ALTER TABLE consumables 
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id)
      `);
      console.log('✅ Columnas agregadas a consumables\n');
    } catch (err) {
      console.log('ℹ️  Columnas ya existen en consumables\n');
    }

    // 4. Agregar updated_by a documents
    console.log('📝 Agregando updated_by a documents...');
    try {
      await sequelize.query(`
        ALTER TABLE documents 
        ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id),
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
      `);
      console.log('✅ Columnas agregadas a documents\n');
    } catch (err) {
      console.log('ℹ️  Columnas ya existen en documents\n');
    }

    // 5. Agregar updated_at a license_assignments
    console.log('📝 Agregando updated_at a license_assignments...');
    try {
      await sequelize.query(`
        ALTER TABLE license_assignments 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id),
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP
      `);
      console.log('✅ Columnas agregadas a license_assignments\n');
    } catch (err) {
      console.log('ℹ️  Columnas ya existen en license_assignments\n');
    }

    console.log('========================================');
    console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

migrate();
