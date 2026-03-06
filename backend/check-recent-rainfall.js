import sequelize from './config/database.js';
import { RainfallRecord, Village } from './models/index.js';
import { Op } from 'sequelize';

async function checkRecentRainfall() {
  try {
    console.log('🌧️  Checking recent rainfall data...\n');

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    console.log(`📅 Date range: ${sevenDaysAgoStr} to ${today}\n`);

    // Count records
    const totalRecords = await RainfallRecord.count();
    const historicalRecords = await RainfallRecord.count({ where: { is_historical: true } });
    const realtimeRecords = await RainfallRecord.count({ where: { is_historical: false } });
    const recentRecords = await RainfallRecord.count({
      where: {
        record_date: { [Op.gte]: sevenDaysAgoStr },
        is_historical: false
      }
    });

    console.log('📊 Rainfall Statistics:');
    console.log(`   Total records: ${totalRecords}`);
    console.log(`   Historical records: ${historicalRecords}`);
    console.log(`   Real-time records: ${realtimeRecords}`);
    console.log(`   Recent (last 7 days): ${recentRecords}\n`);

    // Show sample recent records
    const recentSamples = await RainfallRecord.findAll({
      where: {
        record_date: { [Op.gte]: sevenDaysAgoStr },
        is_historical: false
      },
      include: [{ model: Village, attributes: ['name'] }],
      order: [['record_date', 'DESC']],
      limit: 10
    });

    if (recentSamples.length > 0) {
      console.log('📋 Recent rainfall samples:');
      recentSamples.forEach(r => {
        console.log(`   ${r.record_date} | ${r.Village?.name || 'Unknown'} | ${r.rainfall_mm}mm | Historical: ${r.is_historical}`);
      });
    } else {
      console.log('⚠️  No recent real-time rainfall records found!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkRecentRainfall();
