const { sequelize } = require('./models');

async function checkUserSchema() {
  try {
    const table = await sequelize.getQueryInterface().describeTable('users');
    console.log('Columnas en tabla users:');
    console.log(Object.keys(table).join(', '));
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkUserSchema();
