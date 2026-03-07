import sequelize from './config/database.js';
import { Village } from './models/index.js';

async function checkHinganghat() {
  try {
    console.log('🔍 Checking Hinganghat village data...\n');

    const village = await Village.findOne({ where: { name: 'Hinganghat' } });

    if (!village) {
      console.log('⚠️  Hinganghat village not found!\n');
      return;
    }

    console.log('✅ Hinganghat Village Details:\n');
    console.log(`   Name: ${village.name}`);
    console.log(`   District: ${village.district}`);
    console.log(`   State: ${village.state}`);
    console.log(`   Population: ${village.population.toLocaleString('en-IN')} people`);
    console.log(`   Latitude: ${village.latitude}`);
    console.log(`   Longitude: ${village.longitude}`);
    console.log(`   Storage Capacity: ${Number(village.storage_capacity).toLocaleString('en-IN')} L`);
    console.log(`   Current Storage: ${Number(village.current_storage).toLocaleString('en-IN')} L`);
    console.log(`   Storage Level: ${Math.round((village.current_storage / village.storage_capacity) * 100)}%`);
    console.log(`   Created: ${village.createdAt}`);
    console.log(`   Updated: ${village.updatedAt}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkHinganghat();
