import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('\n🔍 Testing MySQL Connection...\n');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('Password length:', process.env.DB_PASSWORD?.length || 0);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('\n✅ Connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT DATABASE() as db, VERSION() as version');
    console.log('Connected to database:', rows[0].db);
    console.log('MySQL version:', rows[0].version);
    
    // Show tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\nTables found:', tables.length);
    tables.forEach(table => console.log('  -', Object.values(table)[0]));
    
    await connection.end();
    console.log('\n✅ Test completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('\n💡 Possible solutions:');
    console.error('1. Check if password is correct in Railway Variables tab');
    console.error('2. Click eye icon (👁️) next to MYSQLPASSWORD to see actual value');
    console.error('3. Try regenerating password in Railway Settings');
    console.error('4. Make sure you copied the password exactly (no extra spaces)\n');
    process.exit(1);
  }
}

testConnection();
