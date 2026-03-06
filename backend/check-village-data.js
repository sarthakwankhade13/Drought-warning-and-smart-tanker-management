import sequelize from './config/database.js';
import { User, Village, RainfallRecord, GroundwaterRecord } from './models/index.js';

async function checkVillageData() {
  try {
    console.log('🔍 Checking village data for local users...\n');

    const users = await User.findAll({
      where: { role: 'local_user' },
      include: [{ model: Village }]
    });

    for (const user of users) {
      console.log(`📧 User: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Village ID: ${user.village_id}`);
      console.log(`   Village: ${user.Village ? user.Village.name : 'N/A'}`);
      
      if (user.village_id) {
        const rainfallCount = await RainfallRecord.count({ where: { village_id: user.village_id } });
        const groundwaterCount = await GroundwaterRecord.count({ where: { village_id: user.village_id } });
        
        console.log(`   Rainfall records: ${rainfallCount}`);
        console.log(`   Groundwater records: ${groundwaterCount}`);
        
        if (rainfallCount > 0) {
          const sample = await RainfallRecord.findOne({ 
            where: { village_id: user.village_id },
            order: [['record_date', 'DESC']]
          });
          console.log(`   Latest rainfall: ${sample.rainfall_mm.toFixed(1)}mm on ${new Date(sample.record_date).toLocaleDateString()}`);
        }
      }
      console.log('');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkVillageData();
