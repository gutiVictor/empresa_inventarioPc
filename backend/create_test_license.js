const SoftwareLicense = require('./models/SoftwareLicense');

async function createTestLicense() {
  try {
    const license = await SoftwareLicense.create({
      name: 'Windows 11 Pro',
      key: 'XXXX-XXXX-XXXX-XXXX',
      type: 'volume',
      seats_total: 50,
      seats_used: 10,
      expiration_date: '2025-12-31',
      cost: 199.99,
      notes: 'Licencia corporativa',
      created_by: 1
    });
    console.log('Licencia creada con ID:', license.id);
  } catch (error) {
    console.error('Error creando licencia:', error);
  }
}

createTestLicense();
