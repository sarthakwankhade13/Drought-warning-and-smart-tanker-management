import sequelize from './config/database.js';
import { User, Village, RainfallRecord, GroundwaterRecord, Tanker, Alert, WaterShortageReport } from './models/index.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database synced\n');

    // Check if villages already exist
    const villageCount = await Village.count();
    if (villageCount > 0) {
      console.log('⚠️  Database already has villages. Skipping seed.');
      console.log('   To reseed, delete all data first or use force: true\n');
      return;
    }

    // 1. Create Villages (Vidarbha Region - Maharashtra) - Real Population Data
    console.log('🏘️  Creating Vidarbha region villages with real population data...');
    const villages = await Village.bulkCreate([
      // Critical villages (high population, low storage) - Vidarbha
      { name: 'Yavatmal', district: 'Yavatmal', state: 'Maharashtra', population: 120000, latitude: 20.3974, longitude: 78.1320, storage_capacity: 5000000, current_storage: 1000000 },
      { name: 'Wardha', district: 'Wardha', state: 'Maharashtra', population: 129000, latitude: 20.7453, longitude: 78.6022, storage_capacity: 5500000, current_storage: 1100000 },
      { name: 'Washim', district: 'Washim', state: 'Maharashtra', population: 108000, latitude: 20.1097, longitude: 77.1350, storage_capacity: 4500000, current_storage: 900000 },
      
      // Alert villages (medium risk) - Vidarbha
      { name: 'Akola', district: 'Akola', state: 'Maharashtra', population: 537000, latitude: 20.7002, longitude: 77.0082, storage_capacity: 22000000, current_storage: 8800000 },
      { name: 'Amravati Rural', district: 'Amravati', state: 'Maharashtra', population: 647000, latitude: 20.9374, longitude: 77.7796, storage_capacity: 27000000, current_storage: 13500000 },
      { name: 'Buldhana', district: 'Buldhana', state: 'Maharashtra', population: 100000, latitude: 20.5311, longitude: 76.1844, storage_capacity: 4200000, current_storage: 2100000 },
      { name: 'Chandrapur Rural', district: 'Chandrapur', state: 'Maharashtra', population: 320000, latitude: 19.9615, longitude: 79.2961, storage_capacity: 13500000, current_storage: 6750000 },
      { name: 'Gondia', district: 'Gondia', state: 'Maharashtra', population: 132000, latitude: 21.4560, longitude: 80.1923, storage_capacity: 5500000, current_storage: 2750000 },
      
      // Normal villages (good storage) - Vidarbha
      { name: 'Nagpur Rural', district: 'Nagpur', state: 'Maharashtra', population: 2405000, latitude: 21.1458, longitude: 79.0882, storage_capacity: 100000000, current_storage: 80000000 },
      { name: 'Bhandara', district: 'Bhandara', state: 'Maharashtra', population: 137000, latitude: 21.1704, longitude: 79.6507, storage_capacity: 5700000, current_storage: 4560000 },
      { name: 'Gadchiroli', district: 'Gadchiroli', state: 'Maharashtra', population: 96000, latitude: 20.1809, longitude: 80.0131, storage_capacity: 4000000, current_storage: 3200000 },
      
      // Additional Vidarbha villages with real population
      { name: 'Hinganghat', district: 'Wardha', state: 'Maharashtra', population: 224017, latitude: 20.5489, longitude: 78.8342, storage_capacity: 9300000, current_storage: 4650000 },
      { name: 'Karanja', district: 'Washim', state: 'Maharashtra', population: 89000, latitude: 20.4826, longitude: 77.4890, storage_capacity: 3700000, current_storage: 1850000 },
      { name: 'Pusad', district: 'Yavatmal', state: 'Maharashtra', population: 72000, latitude: 19.9142, longitude: 77.5779, storage_capacity: 3000000, current_storage: 1200000 },
      { name: 'Wani', district: 'Yavatmal', state: 'Maharashtra', population: 60000, latitude: 20.0554, longitude: 78.9530, storage_capacity: 2500000, current_storage: 1250000 },
      { name: 'Arvi', district: 'Wardha', state: 'Maharashtra', population: 52000, latitude: 20.9978, longitude: 78.2281, storage_capacity: 2200000, current_storage: 1760000 },
      { name: 'Deoli', district: 'Wardha', state: 'Maharashtra', population: 45000, latitude: 20.6500, longitude: 78.4800, storage_capacity: 1900000, current_storage: 1520000 },
      { name: 'Morshi', district: 'Amravati', state: 'Maharashtra', population: 68000, latitude: 21.3400, longitude: 77.8900, storage_capacity: 2800000, current_storage: 2240000 },
      { name: 'Achalpur', district: 'Amravati', state: 'Maharashtra', population: 109000, latitude: 21.2600, longitude: 77.5100, storage_capacity: 4500000, current_storage: 2250000 },
      { name: 'Daryapur', district: 'Amravati', state: 'Maharashtra', population: 55000, latitude: 20.9200, longitude: 77.3300, storage_capacity: 2300000, current_storage: 1150000 }
    ]);
    console.log(`✅ Created ${villages.length} Vidarbha villages with real population data\n`);

    // 2. Create Users (Admin + Local Users linked to villages)
    console.log('👥 Creating users...');
    const users = await User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@water.gov',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        village_id: null
      },
      {
        username: 'Ramesh Patil',
        email: 'localuser@water.gov',
        password: await bcrypt.hash('local123', 10),
        role: 'local_user',
        village_id: villages[0].id,  // Yavatmal
        phone: '9876543210'
      },
      {
        username: 'Suresh Deshmukh',
        email: 'suresh@village.com',
        password: await bcrypt.hash('local123', 10),
        role: 'local_user',
        village_id: villages[1].id,  // Wardha
        phone: '9876543211'
      },
      {
        username: 'Priya Kulkarni',
        email: 'priya@village.com',
        password: await bcrypt.hash('local123', 10),
        role: 'local_user',
        village_id: villages[3].id,  // Akola
        phone: '9876543212'
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // 3. Create Historical Rainfall Data (last 5 years average)
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

    // 4. Create Current Year Rainfall Data (showing deficit)
    console.log('🌧️  Creating current rainfall data...');
    const currentRainfall = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    for (const village of villages) {
      for (let i = 5; i >= 0; i--) {
        const month = currentMonth - i;
        const date = new Date(currentYear, month, 15);
        const baseRainfall = (month >= 5 && month <= 8) ? 150 : 30;
        
        let deficitFactor = 0.9;
        if (village.current_storage < village.storage_capacity * 0.3) {
          deficitFactor = 0.6;
        } else if (village.current_storage < village.storage_capacity * 0.5) {
          deficitFactor = 0.75;
        }
        
        currentRainfall.push({
          village_id: village.id,
          record_date: date,
          rainfall_mm: (baseRainfall * deficitFactor) + (Math.random() * 20 - 10),
          is_historical: false
        });
      }
    }
    await RainfallRecord.bulkCreate(currentRainfall);
    console.log(`✅ Created ${currentRainfall.length} current rainfall records\n`);

    // 5. Create Groundwater Data
    console.log('💧 Creating groundwater data...');
    const groundwaterRecords = [];
    
    for (const village of villages) {
      let baseLevel = 10;
      if (village.current_storage < village.storage_capacity * 0.3) {
        baseLevel = 18;
      } else if (village.current_storage < village.storage_capacity * 0.5) {
        baseLevel = 14;
      }
      
      for (let i = 5; i >= 0; i--) {
        const month = currentMonth - i;
        const date = new Date(currentYear, month, 1);
        const trendFactor = village.current_storage < village.storage_capacity * 0.3 ? 0.5 : 0.2;
        const waterLevel = baseLevel + (5 - i) * trendFactor + (Math.random() * 2 - 1);
        
        groundwaterRecords.push({
          village_id: village.id,
          measurement_date: date,
          water_level: waterLevel,
          quality_index: 70 + (Math.random() * 20)
        });
      }
    }
    await GroundwaterRecord.bulkCreate(groundwaterRecords);
    console.log(`✅ Created ${groundwaterRecords.length} groundwater records\n`);

    // 6. Create Tankers
    console.log('🚚 Creating tankers for Vidarbha...');
    const tankers = await Tanker.bulkCreate([
      { registration_number: 'MH-31-AB-1234', capacity: 10000, status: 'available', current_latitude: 21.1458, current_longitude: 79.0882 },
      { registration_number: 'MH-31-CD-5678', capacity: 12000, status: 'available', current_latitude: 20.9374, current_longitude: 77.7796 },
      { registration_number: 'MH-32-EF-9012', capacity: 10000, status: 'available', current_latitude: 20.7002, current_longitude: 77.0082 },
      { registration_number: 'MH-33-GH-3456', capacity: 15000, status: 'available', current_latitude: 20.3974, current_longitude: 78.1320 },
      { registration_number: 'MH-34-IJ-7890', capacity: 10000, status: 'available', current_latitude: 20.7453, current_longitude: 78.6022 },
      { registration_number: 'MH-35-KL-2345', capacity: 12000, status: 'available', current_latitude: 20.1097, current_longitude: 77.1350 },
      { registration_number: 'MH-36-MN-6789', capacity: 10000, status: 'available', current_latitude: 20.5311, current_longitude: 76.1844 },
      { registration_number: 'MH-37-OP-0123', capacity: 10000, status: 'available', current_latitude: 19.9615, current_longitude: 79.2961 },
      { registration_number: 'MH-38-QR-4567', capacity: 15000, status: 'maintenance', current_latitude: 21.1704, current_longitude: 79.6507 },
      { registration_number: 'MH-39-ST-8901', capacity: 12000, status: 'available', current_latitude: 21.4560, current_longitude: 80.1923 }
    ]);
    console.log(`✅ Created ${tankers.length} tankers\n`);

    // 7. Create Alerts for Critical Villages
    console.log('🔔 Creating alerts...');
    const alerts = [];
    for (const village of villages) {
      if (village.current_storage < village.storage_capacity * 0.3) {
        alerts.push({
          village_id: village.id,
          severity: 'critical',
          message: `Critical water shortage detected. Storage at ${Math.round((village.current_storage / village.storage_capacity) * 100)}%. Immediate tanker allocation required.`,
          wsi_score: 75 + Math.random() * 20,
          is_resolved: false
        });
      } else if (village.current_storage < village.storage_capacity * 0.5) {
        alerts.push({
          village_id: village.id,
          severity: 'alert',
          message: `Water stress detected. Storage at ${Math.round((village.current_storage / village.storage_capacity) * 100)}%. Monitor closely.`,
          wsi_score: 50 + Math.random() * 20,
          is_resolved: false
        });
      }
    }
    await Alert.bulkCreate(alerts);
    console.log(`✅ Created ${alerts.length} alerts\n`);

    // 8. Create sample water shortage reports
    console.log('📝 Creating sample shortage reports...');
    const sampleReports = await WaterShortageReport.bulkCreate([
      {
        user_id: users[1].id,  // Ramesh Patil at Yavatmal
        village_id: villages[0].id,
        description: 'Taps have been dry for 3 days. Borewells are running at low capacity. Urgent need for tanker supply.',
        severity: 'high',
        status: 'acknowledged'
      },
      {
        user_id: users[2].id,  // Suresh Deshmukh at Wardha
        village_id: villages[1].id,
        description: 'Water supply is intermittent. Village well water level has dropped significantly over the past week.',
        severity: 'medium',
        status: 'pending'
      }
    ]);
    console.log(`✅ Created ${sampleReports.length} shortage reports\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Villages: ${villages.length}`);
    console.log(`   - Historical Rainfall: ${historicalRainfall.length}`);
    console.log(`   - Current Rainfall: ${currentRainfall.length}`);
    console.log(`   - Groundwater Records: ${groundwaterRecords.length}`);
    console.log(`   - Tankers: ${tankers.length}`);
    console.log(`   - Alerts: ${alerts.length}`);
    console.log(`   - Shortage Reports: ${sampleReports.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin:      admin@water.gov / admin123');
    console.log('   Local User: localuser@water.gov / local123  (Yavatmal village)');
    console.log('   Local User: suresh@village.com / local123   (Wardha village)');
    console.log('   Local User: priya@village.com / local123    (Akola village)\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
