import express from 'express';
import weatherService from '../services/weatherService.js';
import { Village, RainfallRecord } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get current weather for a specific village
router.get('/village/:villageId', authenticate, async (req, res, next) => {
  try {
    const village = await Village.findByPk(req.params.villageId);
    
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }

    const weatherData = await weatherService.fetchWeatherData(village.name);
    
    res.json({
      village: {
        id: village.id,
        name: village.name,
        district: village.district
      },
      weather: weatherData
    });
  } catch (error) {
    next(error);
  }
});

// Get weather for all villages
router.get('/all', authenticate, async (req, res, next) => {
  try {
    const villages = await Village.findAll({
      attributes: ['id', 'name', 'district']
    });

    const weatherData = await weatherService.fetchMultipleVillages(villages);
    
    res.json({
      total: villages.length,
      successful: weatherData.filter(w => w.success).length,
      failed: weatherData.filter(w => !w.success).length,
      data: weatherData
    });
  } catch (error) {
    next(error);
  }
});

// Sync weather data to database (save as rainfall records)
router.post('/sync', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const villages = await Village.findAll({
      attributes: ['id', 'name', 'district']
    });

    const weatherData = await weatherService.fetchMultipleVillages(villages);
    const savedRecords = [];

    for (const data of weatherData) {
      if (data.success && data.weather.rainfall > 0) {
        const record = await RainfallRecord.create({
          villageId: data.villageId,
          rainfall: data.weather.rainfall,
          date: data.weather.timestamp,
          source: data.weather.source
        });
        savedRecords.push(record);
      }
    }

    res.json({
      message: 'Weather data synced successfully',
      totalVillages: villages.length,
      weatherFetched: weatherData.filter(w => w.success).length,
      rainfallRecordsSaved: savedRecords.length,
      data: weatherData
    });
  } catch (error) {
    next(error);
  }
});

// Get forecast for a village (7-day detailed forecast)
router.get('/forecast/:villageId', authenticate, async (req, res, next) => {
  try {
    const village = await Village.findByPk(req.params.villageId);
    
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }

    const days = parseInt(req.query.days) || 7;
    const forecast = await weatherService.fetchCompleteForecast(village.name, days);
    
    res.json({
      village: {
        id: village.id,
        name: village.name,
        district: village.district
      },
      forecast: forecast
    });
  } catch (error) {
    next(error);
  }
});

// Test weather API connection
router.get('/test', authenticate, async (req, res, next) => {
  try {
    const testCity = 'Nagpur';
    const weatherData = await weatherService.fetchWeatherData(testCity);
    
    res.json({
      message: 'Weather API is working',
      testCity: testCity,
      data: weatherData
    });
  } catch (error) {
    res.status(500).json({
      error: 'Weather API test failed',
      message: error.message
    });
  }
});

export default router;
