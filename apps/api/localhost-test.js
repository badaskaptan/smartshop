const http = require('http');

console.log('🔍 Localhost bağlantı testi...');

// Localhost ile dene
const options = {
  hostname: 'localhost',  // 127.0.0.1 yerine localhost
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
  });
});

req.on('error', (err) => {
  console.error('❌ Localhost test hatası:', err.message);
  
  // Şimdi 127.0.0.1 ile dene
  console.log('\n🔍 127.0.0.1 ile deneniyor...');
  const options2 = {
    hostname: '127.0.0.1',
    port: 4000,
    path: '/health',
    method: 'GET'
  };
  
  const req2 = http.request(options2, (res) => {
    console.log(`✅ 127.0.0.1 durum kodu: ${res.statusCode}`);
  });
  
  req2.on('error', (err2) => {
    console.error('❌ 127.0.0.1 hatası:', err2.message);
  });
  
  req2.end();
});

req.setTimeout(5000, () => {
  console.error('❌ Timeout');
  req.destroy();
});

req.end();
