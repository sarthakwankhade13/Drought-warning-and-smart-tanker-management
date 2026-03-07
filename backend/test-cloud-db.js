import sequelize from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing cloud database connection...');
console.log('Host:', process.env.DB_HOST);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);
console.log('Port:', process.env.DB_PORT);
console.log('SSL:', process.env.DB_SSL);

sequelize.authenticate()
  .then(() => {
    console.log('\n✅ Connection successful!');
    console.log('Database is accessible and ready to use.');
    return sequelize.close();
  })
  .catch(err => {
    console.error('\n❌ Connection failed:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  });
