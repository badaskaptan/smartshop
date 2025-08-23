// Simple auth test
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function simpleTest() {
  try {
    console.log('Testing registration...');
    
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'testpass123'
    };

    const response = await fetch('http://127.0.0.1:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (!response.ok) {
      console.error('HTTP Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('Registration successful:', data);

    if (data.token) {
      console.log('JWT Token received:', data.token.substring(0, 20) + '...');
    }

  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Full error:', error);
  }
}

simpleTest();
