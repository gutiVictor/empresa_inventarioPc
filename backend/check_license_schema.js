const { sequelize } = require('./models');

async function checkLicenseSchema() {
  try {
    const table = await sequelize.getQueryInterface().describeTable('software_licenses');
    console.log('Columnas en tabla software_licenses:');
    console.log(Object.keys(table).join(', '));
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkLicenseSchema();
