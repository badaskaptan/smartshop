const http = require('http');

console.log('🔍 Port 4001 bağlantı testi...');

const options = {
  hostname: '127.0.0.1',
  port: 4001,  // Yeni port
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
    console.log('🎉 Bağlantı başarılı!');
  });
});

req.on('error', (err) => {
  console.error('❌ Port 4001 hatası:', err.message);
});

req.setTimeout(5000, () => {
  console.error('❌ Timeout');
  req.destroy();
});

req.end();
