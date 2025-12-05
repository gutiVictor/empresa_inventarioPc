const { sequelize } = require('./models');
const SoftwareLicense = require('./models/SoftwareLicense');
const Consumable = require('./models/Consumable');
const Document = require('./models/Document');

async function syncTables() {
  try {
    console.log('Syncing missing tables...');
    
    await SoftwareLicense.sync();
    console.log('SoftwareLicense table synced.');
    
    await Consumable.sync();
    console.log('Consumable table synced.');
    
    await Document.sync();
    console.log('Document table synced.');
    
    console.log('All missing tables synced successfully.');
  } catch (error) {
    console.error('Error syncing tables:', error);
  }
}

syncTables();
