// Complete auth test with health check first
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function comprehensiveTest() {
  console.log('🧪 Starting comprehensive auth test...');
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('http://127.0.0.1:4000/health');
    
    if (!healthResponse.ok) {
      console.error('❌ Health check failed:', healthResponse.status);
      return;
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Health check successful:', healthData);
    
    // Test 2: Registration
    console.log('\n2️⃣ Testing user registration...');
    
    const testUser = {
      email: `test-user-${Date.now()}@smartshop.com`,
      password: 'SecurePass123!'
    };
    
    console.log('Registering user:', testUser.email);
    
    const registerResponse = await fetch('http://127.0.0.1:4000/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    console.log('Register response status:', registerResponse.status);
    console.log('Register response headers:', Object.fromEntries(registerResponse.headers.entries()));

    if (!registerResponse.ok) {
      const errorText = await registerResponse.text();
      console.error('❌ Registration failed - Status:', registerResponse.status);
      console.error('❌ Registration failed - Response:', errorText);
      return;
    }

    const registerData = await registerResponse.json();
    console.log('✅ Registration successful:', {
      success: registerData.success,
      user: registerData.user,
      hasToken: !!registerData.token
    });

    if (!registerData.token) {
      console.error('❌ No token received in registration response');
      return;
    }

    const token = registerData.token;
    console.log('🔑 Token received (first 50 chars):', token.substring(0, 50) + '...');

    // Test 3: Login with the same credentials
    console.log('\n3️⃣ Testing user login...');
    
    const loginResponse = await fetch('http://127.0.0.1:4000/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error('❌ Login failed - Status:', loginResponse.status);
      console.error('❌ Login failed - Response:', errorText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', {
      success: loginData.success,
      user: loginData.user,
      hasToken: !!loginData.token
    });

    // Test 4: Access protected profile endpoint
    console.log('\n4️⃣ Testing protected profile endpoint...');
    
    const profileResponse = await fetch('http://127.0.0.1:4000/api/auth/profile', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('❌ Profile access failed - Status:', profileResponse.status);
      console.error('❌ Profile access failed - Response:', errorText);
      return;
    }

    const profileData = await profileResponse.json();
    console.log('✅ Profile access successful:', profileData);

    console.log('\n🎉 All auth tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Health endpoint working');
    console.log('   ✅ User registration working');
    console.log('   ✅ User login working');
    console.log('   ✅ Protected route access working');
    console.log('   ✅ JWT token generation and validation working');

  } catch (error) {
    console.error('\n❌ Test suite failed with error:');
    console.error('Error message:', error.message);
    console.error('Error type:', error.constructor.name);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    console.error('Full error object:', error);
  }
}

comprehensiveTest();
