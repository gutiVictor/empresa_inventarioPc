const { Asset, User, sequelize } = require('./models');

async function checkData() {
  try {
    // Desactivar logging para esta consulta
    sequelize.options.logging = false;
    
    const assetCount = await Asset.count();
    const userCount = await User.count();
    
    console.log('----------------------------------------');
    console.log(`Assets in DB: ${assetCount}`);
    console.log(`Users in DB: ${userCount}`);
    console.log('----------------------------------------');
    
    if (assetCount > 0) {
      const firstAsset = await Asset.findOne();
      console.log('First Asset ID:', firstAsset.id);
      console.log('First Asset Name:', firstAsset.name);
    }
  } catch (error) {
    console.error('Error checking data:', error);
  }
}

checkData();
