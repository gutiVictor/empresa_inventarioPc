const { sequelize } = require('./models');

async function checkSchema() {
  try {
    const table = await sequelize.getQueryInterface().describeTable('assets');
    console.log('Columnas en tabla assets:');
    console.log(Object.keys(table).join(', '));
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema();
