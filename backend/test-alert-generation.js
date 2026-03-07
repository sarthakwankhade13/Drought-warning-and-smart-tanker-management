import { generateAutomaticAlerts, resolveImprovedAlerts } from './services/alertGenerator.js';
import sequelize from './config/database.js';

async function test() {
  try {
    console.log('🧪 Testing automatic alert generation...\n');
    
    await generateAutomaticAlerts();
    await resolveImprovedAlerts();
    
    console.log('\n✅ Test completed successfully!\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

test();
