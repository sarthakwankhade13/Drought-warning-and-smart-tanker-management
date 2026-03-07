import { Village, Alert, RainfallRecord, GroundwaterRecord } from '../models/index.js';
import { WSICalculator } from './wsiCalculator.js';
import { Op } from 'sequelize';

/**
 * Automatically generate alerts based on water conditions
 * Analyzes: Storage levels, WSI, Rainfall deficit, Groundwater depletion
 */
export async function generateAutomaticAlerts() {
  console.log('\n🔍 Analyzing water conditions for automatic alert generation...\n');

  try {
    const villages = await Village.findAll();
    let alertsCreated = 0;
    let alertsUpdated = 0;

    for (const village of villages) {
      try {
        // Calculate WSI for the village
        const wsiData = await WSICalculator.calculateWSI(village.id);
        const wsi = wsiData.wsi;

        // Get storage percentage
        const storagePct = (village.current_storage / village.storage_capacity) * 100;

        // Get recent rainfall (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentRainfall = await RainfallRecord.sum('rainfall_mm', {
          where: {
            village_id: village.id,
            record_date: { [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0] }
          }
        }) || 0;

        // Get latest groundwater level
        const latestGW = await GroundwaterRecord.findOne({
          where: { village_id: village.id },
          order: [['measurement_date', 'DESC']]
        });

        // Determine severity based on multiple factors
        let severity = 'normal';
        let message = '';

        // CRITICAL conditions
        if (storagePct < 25 || wsi > 80) {
          severity = 'critical';
          message = `🚨 CRITICAL: Storage at ${storagePct.toFixed(0)}%, WSI: ${wsi.toFixed(1)}. `;
          
          if (recentRainfall < 50) {
            message += `Severe rainfall deficit (${recentRainfall.toFixed(0)}mm in 30 days). `;
          }
          
          if (latestGW && latestGW.water_level > 15) {
            message += `Groundwater critically low (${latestGW.water_level.toFixed(1)}m depth). `;
          }
          
          message += 'IMMEDIATE tanker allocation required!';
        }
        // ALERT conditions
        else if (storagePct < 40 || wsi > 60) {
          severity = 'alert';
          message = `⚠️ ALERT: Storage at ${storagePct.toFixed(0)}%, WSI: ${wsi.toFixed(1)}. `;
          
          if (recentRainfall < 100) {
            message += `Low rainfall (${recentRainfall.toFixed(0)}mm in 30 days). `;
          }
          
          if (latestGW && latestGW.water_level > 12) {
            message += `Groundwater declining (${latestGW.water_level.toFixed(1)}m depth). `;
          }
          
          message += 'Monitor closely and prepare for intervention.';
        }
        // NORMAL conditions
        else {
          severity = 'normal';
          message = `✅ NORMAL: Storage at ${storagePct.toFixed(0)}%, WSI: ${wsi.toFixed(1)}. Water supply stable.`;
        }

        // Check if alert already exists for this village
        const existingAlert = await Alert.findOne({
          where: {
            village_id: village.id,
            is_resolved: false
          }
        });

        if (existingAlert) {
          // Update existing alert if severity changed
          if (existingAlert.severity !== severity) {
            await existingAlert.update({
              severity,
              message,
              wsi_score: wsi
            });
            alertsUpdated++;
            console.log(`  ✏️  Updated: ${village.name} - ${severity.toUpperCase()}`);
          }
        } else {
          // Create new alert only if not normal
          if (severity !== 'normal') {
            await Alert.create({
              village_id: village.id,
              severity,
              message,
              wsi_score: wsi,
              is_resolved: false
            });
            alertsCreated++;
            console.log(`  ✨ Created: ${village.name} - ${severity.toUpperCase()}`);
          }
        }

      } catch (err) {
        console.error(`  ❌ Error processing ${village.name}:`, err.message);
      }
    }

    console.log(`\n✅ Alert generation complete:`);
    console.log(`   New alerts created: ${alertsCreated}`);
    console.log(`   Alerts updated: ${alertsUpdated}\n`);

    return { created: alertsCreated, updated: alertsUpdated };

  } catch (error) {
    console.error('❌ Alert generation failed:', error.message);
    throw error;
  }
}

/**
 * Resolve alerts for villages that have improved conditions
 */
export async function resolveImprovedAlerts() {
  try {
    const villages = await Village.findAll();
    let resolved = 0;

    for (const village of villages) {
      const storagePct = (village.current_storage / village.storage_capacity) * 100;
      const wsiData = await WSICalculator.calculateWSI(village.id);
      const wsi = wsiData.wsi;

      // If conditions improved, resolve the alert
      if (storagePct > 50 && wsi < 50) {
        const updated = await Alert.update(
          { is_resolved: true },
          {
            where: {
              village_id: village.id,
              is_resolved: false
            }
          }
        );
        
        if (updated[0] > 0) {
          resolved += updated[0];
          console.log(`  ✓ Resolved alert for ${village.name} (conditions improved)`);
        }
      }
    }

    if (resolved > 0) {
      console.log(`\n✅ Resolved ${resolved} alerts due to improved conditions\n`);
    }

    return resolved;

  } catch (error) {
    console.error('Error resolving alerts:', error.message);
    return 0;
  }
}

export default { generateAutomaticAlerts, resolveImprovedAlerts };
