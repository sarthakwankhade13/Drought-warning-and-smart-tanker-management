import sequelize from './config/database.js';
import { Village } from './models/index.js';

// Real population data for Vidarbha region villages with realistic storage capacity
const realVillageData = {
  'Yavatmal': { population: 120000, storage_capacity: 5000000, current_storage: 1000000 },
  'Wardha': { population: 129000, storage_capacity: 5500000, current_storage: 1100000 },
  'Washim': { population: 108000, storage_capacity: 4500000, current_storage: 900000 },
  'Akola': { population: 537000, storage_capacity: 22000000, current_storage: 8800000 },
  'Amravati Rural': { population: 647000, storage_capacity: 27000000, current_storage: 13500000 },
  'Buldhana': { population: 100000, storage_capacity: 4200000, current_storage: 2100000 },
  'Chandrapur Rural': { population: 320000, storage_capacity: 13500000, current_storage: 6750000 },
  'Gondia': { population: 132000, storage_capacity: 5500000, current_storage: 2750000 },
  'Nagpur Rural': { population: 2405000, storage_capacity: 99999999, current_storage: 80000000 },
  'Bhandara': { population: 137000, storage_capacity: 5700000, current_storage: 4560000 },
  'Gadchiroli': { population: 96000, storage_capacity: 4000000, current_storage: 3200000 },
  'Hinganghat': { population: 224017, storage_capacity: 9300000, current_storage: 4650000 },
  'Karanja': { population: 89000, storage_capacity: 3700000, current_storage: 1850000 },
  'Pusad': { population: 72000, storage_capacity: 3000000, current_storage: 1200000 },
  'Wani': { population: 60000, storage_capacity: 2500000, current_storage: 1250000 },
  'Arvi': { population: 52000, storage_capacity: 2200000, current_storage: 1760000 },
  'Deoli': { population: 45000, storage_capacity: 1900000, current_storage: 1520000 },
  'Morshi': { population: 68000, storage_capacity: 2800000, current_storage: 2240000 },
  'Achalpur': { population: 109000, storage_capacity: 4500000, current_storage: 2250000 },
  'Daryapur': { population: 55000, storage_capacity: 2300000, current_storage: 1150000 }
};

async function updateRealPopulation() {
  try {
    console.log('🔄 Updating villages with real population data...\n');

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const [villageName, data] of Object.entries(realVillageData)) {
      const village = await Village.findOne({ where: { name: villageName } });
      
      if (village) {
        const oldPopulation = village.population;
        
        await village.update({
          population: data.population,
          storage_capacity: data.storage_capacity,
          current_storage: data.current_storage
        });
        
        console.log(`✅ ${villageName}:`);
        console.log(`   Population: ${oldPopulation.toLocaleString('en-IN')} → ${data.population.toLocaleString('en-IN')}`);
        console.log(`   Storage Capacity: ${data.storage_capacity.toLocaleString('en-IN')} L`);
        console.log(`   Current Storage: ${data.current_storage.toLocaleString('en-IN')} L`);
        console.log(`   Storage Level: ${Math.round((data.current_storage / data.storage_capacity) * 100)}%\n`);
        
        updatedCount++;
      } else {
        console.log(`⚠️  Village not found: ${villageName}\n`);
        notFoundCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updatedCount} villages`);
    console.log(`   ⚠️  Not Found: ${notFoundCount} villages`);
    console.log('\n🎉 Population update completed!\n');

  } catch (error) {
    console.error('❌ Error updating population:', error);
  } finally {
    await sequelize.close();
  }
}

updateRealPopulation();
