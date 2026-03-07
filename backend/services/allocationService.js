import { Village, Tanker, Allocation, Alert } from '../models/index.js';
import { WSICalculator } from './wsiCalculator.js';

export class AllocationService {
  
  static async calculatePriority(villageId) {
    const village = await Village.findByPk(villageId);
    if (!village) throw new Error('Village not found');

    const wsiData = await WSICalculator.calculateWSI(villageId);
    
    const storageDeficit = ((village.storage_capacity - village.current_storage) / village.storage_capacity) * 100;
    const normalizedPopulation = Math.min(100, (village.population / 50000) * 100);

    const priority = (
      (wsiData.wsi * 0.5) +
      (normalizedPopulation * 0.3) +
      (storageDeficit * 0.2)
    );

    return {
      villageId,
      priority: parseFloat(priority.toFixed(2)),
      wsi: wsiData.wsi,
      storageDeficit,
      population: village.population
    };
  }

  static async allocateTankers() {
    try {
      // Get all available tankers
      const availableTankers = await Tanker.findAll({
        where: { status: 'available' }
      });

      if (availableTankers.length === 0) {
        return { 
          success: false,
          message: 'No tankers available for allocation', 
          allocations: [] 
        };
      }

      // Get unresolved alerts with their villages
      const alerts = await Alert.findAll({
        where: { is_resolved: false },
        include: [{ 
          model: Village,
          attributes: ['id', 'name', 'district', 'population', 'current_storage', 'storage_capacity']
        }],
        order: [
          ['severity', 'DESC'], // Critical first
          ['wsi_score', 'DESC'], // Higher WSI first
          ['createdAt', 'ASC'] // Older alerts first
        ]
      });

      if (alerts.length === 0) {
        return {
          success: false,
          message: 'No unresolved alerts found. Generate alerts first.',
          allocations: []
        };
      }

      // Calculate priority for each alert's village
      const priorities = [];
      for (const alert of alerts) {
        if (!alert.Village) continue;
        
        try {
          const priority = await this.calculatePriority(alert.Village.id);
          
          // Boost priority based on alert severity
          let severityBoost = 0;
          if (alert.severity === 'critical') severityBoost = 20;
          else if (alert.severity === 'alert') severityBoost = 10;
          
          priorities.push({
            ...priority,
            priority: priority.priority + severityBoost,
            alertId: alert.id,
            severity: alert.severity
          });
        } catch (error) {
          console.error(`Error calculating priority for village ${alert.Village.id}:`, error.message);
        }
      }

      if (priorities.length === 0) {
        return {
          success: false,
          message: 'Could not calculate priorities for any alert',
          allocations: []
        };
      }

      // Sort by priority (highest first)
      priorities.sort((a, b) => b.priority - a.priority);

      // Allocate tankers to highest priority villages
      const allocations = [];
      const numAllocations = Math.min(availableTankers.length, priorities.length);
      
      for (let i = 0; i < numAllocations; i++) {
        const tanker = availableTankers[i];
        const village = priorities[i];

        const allocation = await Allocation.create({
          village_id: village.villageId,
          tanker_id: tanker.id,
          priority_score: village.priority,
          status: 'pending',
          allocation_date: new Date()
        });

        // Update tanker status
        await tanker.update({ status: 'assigned' });

        allocations.push({
          allocationId: allocation.id,
          tankerId: tanker.id,
          tankerRegistration: tanker.registration_number,
          villageId: village.villageId,
          priorityScore: village.priority,
          severity: village.severity
        });
      }

      return {
        success: true,
        message: `Successfully allocated ${allocations.length} tanker(s) to ${allocations.length} critical village(s) based on alerts`,
        allocations,
        totalAlerts: alerts.length,
        totalTankers: availableTankers.length
      };
    } catch (error) {
      console.error('Allocation error:', error);
      throw new Error(`Allocation failed: ${error.message}`);
    }
  }

  static async getAllocations() {
    const allocations = await Allocation.findAll({
      include: [
        { model: Village, attributes: ['name', 'district', 'latitude', 'longitude'] },
        { model: Tanker, attributes: ['registration_number', 'capacity', 'status'] }
      ],
      order: [['priority_score', 'DESC']]
    });

    return allocations;
  }
}
