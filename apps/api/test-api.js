const http = require('http');

// Test API endpoints
async function testAPI() {
  console.log('Testing SmartShop API...\n');
  
  // Test root endpoint
  try {
    const options = {
      hostname: '127.0.0.1',
      port: 4000,
      path: '/',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('✅ Root endpoint response:');
        console.log(data);
        console.log('\n');
        
        // Test listings endpoint
        testListings();
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ Error testing root endpoint:', e.message);
    });
    
    req.end();
  } catch (error) {
    console.error('❌ Failed to test API:', error.message);
  }
}

function testListings() {
  const options = {
    hostname: '127.0.0.1',
    port: 4000,
    path: '/listings',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('✅ Listings endpoint response:');
      console.log(data);
      console.log('\n');
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ Error testing listings endpoint:', e.message);
  });
  
  req.end();
}

testAPI();
