const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 4000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('✅ Response:', data);
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
});

req.end();
