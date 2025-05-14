// Simple script to test SRP registration directly
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function main() {
  console.log('Testing SRP registration directly...');
  
  try {
    // Generate test SRP credentials
    const salt = crypto.randomBytes(32).toString('hex');
    const verifier = crypto.randomBytes(256).toString('hex');
    const phoneNumber = `9999${Math.floor(Math.random() * 1000000)}`;
    const name = 'Test User';
    
    console.log(`Test data: phone=${phoneNumber}, name=${name}`);
    console.log(`Salt length: ${salt.length}, Verifier length: ${verifier.length}`);
    
    // Try to find a user with this number (should not exist)
    const existingUser = await prisma.user.findUnique({
      where: {
        number: phoneNumber
      }
    });
    
    console.log('Existing user check result:', existingUser);
    
    // Create a new user with SRP credentials
    const user = await prisma.user.create({
      data: {
        number: phoneNumber,
        name: name,
        srpSalt: salt,
        srpVerifier: verifier
      }
    });
    
    console.log('User created successfully:', user);
    
    // Create balance for new user
    const balance = await prisma.balance.create({
      data: {
        userId: user.id,
        amount: 0,
        locked: 0
      }
    });
    
    console.log('Balance created successfully:', balance);
    
    return { success: true, user };
  } catch (error) {
    console.error('SRP registration test failed:');
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