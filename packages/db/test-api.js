// Test script to directly call the SRP registration API
const crypto = require('crypto');
const fetch = require('node-fetch');

async function testApi() {
  console.log('Testing SRP registration API endpoint...');
  
  try {
    // Generate test SRP credentials
    const salt = crypto.randomBytes(32).toString('hex');
    const verifier = crypto.randomBytes(256).toString('hex');
    const phoneNumber = `9999${Math.floor(Math.random() * 1000000)}`;
    const name = 'Test API User';
    
    console.log(`Test data: phone=${phoneNumber}, name=${name}`);
    
    // Call the API endpoint directly
    const response = await fetch('http://localhost:3002/api/auth/srp/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        salt,
        verifier,
        name
      })
    });
    
    const responseText = await response.text();
    console.log(`Response status: ${response.status}`);
    console.log('Response headers:', response.headers.raw());
    
    try {
      const data = JSON.parse(responseText);
      console.log('Response data:', data);
      return { success: true, data };
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.log('Raw response:', responseText.substring(0, 500) + (responseText.length > 500 ? '...(truncated)' : ''));
      return { success: false, error: parseError, responseText };
    }
  } catch (error) {
    console.error('API test failed:', error);
    return { success: false, error };
  }
}

testApi()
  .then(result => {
    console.log('Test complete:', result.success ? 'SUCCESS' : 'FAILED');
    process.exit(result.success ? 0 : 1);
  });