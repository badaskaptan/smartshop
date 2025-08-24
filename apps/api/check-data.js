const http = require('http');

console.log('📊 SmartShop API Veri Kontrolü\n');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
  });
}

async function checkData() {
  try {
    // Ürünleri kontrol et
    console.log('📦 Ürünler kontrol ediliyor...');
    const products = await makeRequest('http://127.0.0.1:4000/api/products');
    
    if (products.success && products.data) {
      console.log(`✅ ${products.data.length} ürün bulundu:`);
      products.data.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.brand})`);
      });
    } else {
      console.log('❌ Ürün bulunamadı');
    }

    // Listingleri kontrol et
    console.log('\n🏷️ Listingler kontrol ediliyor...');
    const listings = await makeRequest('http://127.0.0.1:4000/api/listings');
    
    if (listings.success && listings.data) {
      console.log(`✅ ${listings.data.total} listing bulundu`);
      if (listings.data.listings && listings.data.listings.length > 0) {
        listings.data.listings.slice(0, 5).forEach((listing, index) => {
          console.log(`   ${index + 1}. ${listing.title} - ${listing.price} TL (${listing.platform})`);
        });
        if (listings.data.listings.length > 5) {
          console.log(`   ... ve ${listings.data.listings.length - 5} tane daha`);
        }
      }
    } else {
      console.log('❌ Listing bulunamadı');
    }

    // API durumu
    console.log('\n🔧 API Durumu:');
    const health = await makeRequest('http://127.0.0.1:4000/health');
    console.log(`✅ API Sağlık: ${health.status}`);

    const apiInfo = await makeRequest('http://127.0.0.1:4000/');
    console.log(`✅ API Adı: ${apiInfo.name}`);
    console.log(`✅ Versiyon: ${apiInfo.version}`);

    console.log('\n🌐 Frontend URL\'leri:');
    console.log('   📱 Ana Sayfa: http://localhost:3000/price-comparison-app.html');
    console.log('   📊 API Root: http://127.0.0.1:4000/');
    console.log('   📦 Ürünler: http://127.0.0.1:4000/api/products');
    console.log('   🏷️ Listingler: http://127.0.0.1:4000/api/listings');

  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

checkData();
