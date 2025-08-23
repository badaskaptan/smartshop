// Test script for auth endpoints
// Run with: node test-auth.js

const API_BASE = 'http://localhost:4000';

async function testAuth() {
  try {
    console.log('🔧 Testing Auth Endpoints...\n');

    // Test user data
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123'
    };

    console.log('1️⃣ Testing Registration...');
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData);

    if (!registerData.success) {
      throw new Error('Registration failed: ' + registerData.error);
    }

    const token = registerData.token;
    console.log('✅ Registration successful!\n');

    console.log('2️⃣ Testing Login...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);

    if (!loginData.success) {
      throw new Error('Login failed: ' + loginData.error);
    }
    console.log('✅ Login successful!\n');

    console.log('3️⃣ Testing Profile (Protected Route)...');
    const profileResponse = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const profileData = await profileResponse.json();
    console.log('Profile Response:', profileData);

    if (!profileData.success) {
      throw new Error('Profile fetch failed: ' + profileData.error);
    }
    console.log('✅ Profile fetch successful!\n');

    console.log('4️⃣ Testing Invalid Token...');
    const invalidTokenResponse = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer invalid-token',
        'Content-Type': 'application/json'
      }
    });

    const invalidTokenData = await invalidTokenResponse.json();
    console.log('Invalid Token Response:', invalidTokenData);

    if (invalidTokenResponse.status !== 401) {
      throw new Error('Expected 401 for invalid token');
    }
    console.log('✅ Invalid token properly rejected!\n');

    console.log('🎉 All auth tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      console.log('✅ Server is running\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Server is not running. Please start the server with: npm run dev');
    console.error('Error:', error.message);
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testAuth();
  }
}

main();
