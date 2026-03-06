import sequelize from './config/database.js';
import { RainfallRecord, Village } from './models/index.js';

async function restoreRainfall() {
  try {
    console.log('🔄 Restoring historical rainfall data...\n');

    const villages = await Village.findAll();
    
    if (villages.length === 0) {
      console.log('❌ No villages found. Please run seed-database.js first.\n');
      return;
    }

    // Create Historical Rainfall Data (last 5 years average)
    console.log('🌧️  Creating historical rainfall data...');
    const historicalRainfall = [];
    for (const village of villages) {
      for (let month = 1; month <= 12; month++) {
        const baseRainfall = month >= 6 && month <= 9 ? 150 : 30;
        historicalRainfall.push({
          village_id: village.id,
          record_date: new Date(2020, month - 1, 15),
          rainfall_mm: baseRainfall + (Math.random() * 50 - 25),
          is_historical: true
        });
      }
    }
    await RainfallRecord.bulkCreate(historicalRainfall);
    console.log(`✅ Created ${historicalRainfall.length} historical rainfall records\n`);

    // Show current data
    const totalRecords = await RainfallRecord.count();
    const historicalCount = await RainfallRecord.count({ where: { is_historical: true } });
    const realtimeCount = await RainfallRecord.count({ where: { is_historical: false } });

    console.log('Current data:');
    console.log(`  Total records: ${totalRecords}`);
    console.log(`  Historical records: ${historicalCount}`);
    console.log(`  Real-time records: ${realtimeCount}\n`);

    console.log('🎉 Historical rainfall data restored successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

restoreRainfall();
