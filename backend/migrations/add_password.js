/**
 * Script de migración para agregar password_hash a la tabla users
 * y asignar un password por defecto a todos los usuarios existentes.
 * 
 * Password por defecto: Inventario2024!
 * 
 * Ejecutar con: node migrations/add_password.js
 */

const bcrypt = require('bcryptjs');
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

const DEFAULT_PASSWORD = 'Inventario2024!';

async function migrate() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    // 1. Verificar si la columna ya existe
    console.log('\n🔍 Verificando si la columna password_hash existe...');
    const [columns] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password_hash'
    `);

    if (columns.length === 0) {
      // 2. Agregar columna password_hash
      console.log('📝 Agregando columna password_hash...');
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN password_hash VARCHAR(255)
      `);
      console.log('✅ Columna password_hash agregada');
    } else {
      console.log('ℹ️  La columna password_hash ya existe');
    }

    // 3. Hashear el password por defecto
    console.log('\n🔐 Generando hash del password por defecto...');
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    console.log('✅ Hash generado');

    // 4. Actualizar usuarios que no tienen password
    console.log('\n👥 Actualizando usuarios sin password...');
    const [result] = await sequelize.query(`
      UPDATE users 
      SET password_hash = :hash 
      WHERE password_hash IS NULL 
      RETURNING id, email
    `, {
      replacements: { hash: hashedPassword }
    });

    console.log(`✅ ${result.length} usuarios actualizados con password por defecto`);
    
    if (result.length > 0) {
      console.log('\n📋 Usuarios actualizados:');
      result.forEach(user => {
        console.log(`   - ${user.email}`);
      });
    }

    console.log('\n========================================');
    console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('========================================');
    console.log(`\n🔑 Password por defecto: ${DEFAULT_PASSWORD}`);
    console.log('⚠️  Los usuarios deben cambiar su password después del primer login\n');

  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

migrate();
