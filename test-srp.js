const fetch = require('node-fetch');

async function testSrpRegistration() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/srp/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+919876543210',
        salt: 'test-salt-value-' + Date.now(),
        verifier: 'test-verifier-value-' + Date.now(),
        name: 'Test User'
      })
    });

    const contentType = response.headers.get('content-type');
    console.log('Response status:', response.status);
    console.log('Content-Type:', contentType);

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('JSON Response:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Non-JSON Response:', text.substring(0, 200) + '...');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testSrpRegistration();
