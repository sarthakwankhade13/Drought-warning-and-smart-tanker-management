import sequelize from './config/database.js';
import { syncDailyData } from './services/weatherSync.js';

async function testSync() {
  try {
    console.log('🧪 Testing weather sync...\n');
    
    await syncDailyData();
    
    console.log('\n✅ Weather sync test completed!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testSync();
