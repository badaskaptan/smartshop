const http = require('http');

console.log('Testing API on port 4001...');

const req = http.get('http://127.0.0.1:4001/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Health check successful:', data);
    
    // Test root endpoint
    const req2 = http.get('http://127.0.0.1:4001/', (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        console.log('✅ Root endpoint successful');
        const apiInfo = JSON.parse(data2);
        console.log('API Name:', apiInfo.name);
        console.log('Available endpoints:');
        console.log('- Products:', Object.keys(apiInfo.endpoints.products).length, 'endpoints');
        console.log('- Listings:', Object.keys(apiInfo.endpoints.listings).length, 'endpoints');
        console.log('- Auth:', Object.keys(apiInfo.endpoints.auth).length, 'endpoints');
      });
    });
    
    req2.on('error', e => console.error('❌ Root endpoint error:', e.message));
  });
});

req.on('error', e => console.error('❌ Health check error:', e.message));
