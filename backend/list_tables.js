const { sequelize } = require('./models');

async function listTables() {
  try {
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('Tablas en la base de datos:');
    console.log(tables.join('\n'));
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

listTables();
