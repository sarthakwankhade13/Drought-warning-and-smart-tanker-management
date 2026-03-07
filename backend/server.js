import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import villageRoutes from './routes/villages.js';
import dataRoutes from './routes/data.js';
import analysisRoutes from './routes/analysis.js';
import tankerRoutes from './routes/tankers.js';
import alertRoutes from './routes/alerts.js';
import weatherRoutes from './routes/weather.js';
import reportRoutes from './routes/reports.js';
import { startDataSyncScheduler } from './services/weatherSync.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.FRONTEND_URL,
    'https://drought-warning-and-smart-tanker-ma.vercel.app',
    'https://drought-warning-and-smart-tanker-management-mvracwrre.vercel.app'
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/tankers', tankerRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Water Governance API is running' });
});

app.use(errorHandler);

// Database connection and server start
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully to Railway MySQL');
    console.log(`📍 Host: ${process.env.DB_HOST}`);
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    
    // Sync database (don't alter existing tables)
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database tables ready');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API available at: http://localhost:${PORT}/api`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);

      // Start automatic data sync (runs now + every 12 hours)
      try {
        startDataSyncScheduler();
      } catch (syncError) {
        console.error('⚠️  Weather sync scheduler failed:', syncError.message);
      }
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

startServer();
