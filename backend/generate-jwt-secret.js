import crypto from 'crypto';

console.log('\n🔐 Generating secure JWT secret...\n');
const secret = crypto.randomBytes(64).toString('hex');
console.log('Copy this to your .env file as JWT_SECRET:\n');
console.log(secret);
console.log('\nExample .env entry:');
console.log(`JWT_SECRET=${secret}\n`);
