// Simple script to test Prisma database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  try {
    // Simple test query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful!');
    console.log('Test query result:', result);
    
    // Test a simple model query
    console.log('Testing User model query...');
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    return { success: true };
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then((result) => {
    console.log('Test completed:', result.success ? 'SUCCESS' : 'FAILED');
    if (!result.success) process.exit(1);
  })
  .catch((e) => {
    console.error('Unexpected error:', e);
    process.exit(1);
  });