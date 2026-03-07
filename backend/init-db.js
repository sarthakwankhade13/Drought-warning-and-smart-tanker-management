import sequelize from './config/database.js';
import './models/index.js';

console.log('🔄 Initializing database...');

sequelize.sync({ force: true })
  .then(() => {
    console.log('✅ Database initialized successfully');
    console.log('📋 All tables created');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  });
