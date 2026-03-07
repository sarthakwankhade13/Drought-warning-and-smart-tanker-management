import sequelize from './config/database.js';
import { Alert, Village } from './models/index.js';

async function checkAlerts() {
  try {
    console.log('🔔 Checking alerts in database...\n');

    const alerts = await Alert.findAll({
      include: [{ model: Village, attributes: ['name', 'district', 'current_storage', 'storage_capacity'] }],
      order: [['severity', 'DESC'], ['createdAt', 'DESC']]
    });

    console.log(`Found ${alerts.length} total alerts\n`);

    const activeAlerts = alerts.filter(a => !a.is_resolved);
    const resolvedAlerts = alerts.filter(a => a.is_resolved);

    console.log(`Active alerts: ${activeAlerts.length}`);
    console.log(`Resolved alerts: ${resolvedAlerts.length}\n`);

    console.log('📋 Alert Details:\n');
    
    alerts.forEach((alert, i) => {
      const village = alert.Village;
      const storagePct = village ? Math.round((village.current_storage / village.storage_capacity) * 100) : 0;
      
      console.log(`${i + 1}. ${alert.severity.toUpperCase()} - ${village?.name || 'Unknown'} (${village?.district || 'N/A'})`);
      console.log(`   Storage: ${storagePct}% (${village?.current_storage}L / ${village?.storage_capacity}L)`);
      console.log(`   Message: ${alert.message}`);
      console.log(`   WSI Score: ${alert.wsi_score ? parseFloat(alert.wsi_score).toFixed(1) : 'N/A'}`);
      console.log(`   Status: ${alert.is_resolved ? '✓ Resolved' : '⚠️ Active'}`);
      console.log(`   Created: ${new Date(alert.createdAt).toLocaleString('en-IN')}`);
      console.log('');
    });

    console.log('\n💡 These alerts are REAL and based on:');
    console.log('   - Actual village storage levels from database');
    console.log('   - WSI (Water Stress Index) calculations');
    console.log('   - Critical threshold: Storage < 30%');
    console.log('   - Alert threshold: Storage < 50%\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkAlerts();
