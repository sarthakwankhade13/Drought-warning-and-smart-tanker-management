import sequelize from './config/database.js';
import { Tanker } from './models/index.js';

const createTankers = async () => {
  try {
    console.log('🚛 Creating 100 tankers...');
    
    // Delete existing tankers
    await Tanker.destroy({ where: {} });
    
    const tankers = [];
    const capacities = [5000, 6000, 8000, 10000];
    const districts = ['Yavatmal', 'Wardha', 'Washim', 'Akola', 'Amravati', 'Buldhana', 'Chandrapur', 'Nagpur'];
    
    for (let i = 1; i <= 100; i++) {
      const capacity = capacities[Math.floor(Math.random() * capacities.length)];
      const district = districts[Math.floor(Math.random() * districts.length)];
      
      tankers.push({
        registration_number: `MH-${31 + Math.floor(i / 20)}-${String(1000 + i).slice(-4)}`,
        capacity: capacity,
        status: 'available',
        current_location: district
      });
    }
    
    await Tanker.bulkCreate(tankers);
    
    console.log('✅ Successfully created 100 tankers');
    console.log(`📊 Distribution:`);
    console.log(`   - 5000L: ${tankers.filter(t => t.capacity === 5000).length}`);
    console.log(`   - 6000L: ${tankers.filter(t => t.capacity === 6000).length}`);
    console.log(`   - 8000L: ${tankers.filter(t => t.capacity === 8000).length}`);
    console.log(`   - 10000L: ${tankers.filter(t => t.capacity === 10000).length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tankers:', error);
    process.exit(1);
  }
};

createTankers();
