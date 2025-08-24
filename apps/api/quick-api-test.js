const http = require('http');

console.log('🔍 API bağlantı testi...');

// Basit health check
const options = {
  hostname: '127.0.0.1',
  port: 4000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Durum kodu: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('📊 Yanıt:', data);
    testProducts();
  });
});

req.on('error', (err) => {
  console.error('❌ Health check hatası:', err.message);
});

req.setTimeout(5000, () => {
  console.error('❌ Health check timeout');
  req.destroy();
});

req.end();

// Products endpoint test
function testProducts() {
  console.log('\n🔍 Products endpoint testi...');
  
  const options = {
    hostname: '127.0.0.1',
    port: 4000,
    path: '/api/products',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Products durum kodu: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log(`📊 ${parsed.products?.length || 0} ürün bulundu`);
      } catch (e) {
        console.log('📊 Yanıt:', data.substring(0, 100));
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Products hatası:', err.message);
  });

  req.setTimeout(5000, () => {
    console.error('❌ Products timeout');
    req.destroy();
  });

  req.end();
}
