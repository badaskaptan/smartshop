const http = require('http');

const API_BASE = 'http://localhost:4001';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createListings() {
  console.log('🏷️ Listingler oluşturuluyor...\n');

  try {
    // Önce ürünleri al
    const productsResponse = await makeRequest('GET', '/api/products');
    
    if (!productsResponse.data.success) {
      console.log('❌ Ürünler alınamadı');
      return;
    }

    const products = productsResponse.data.products;
    console.log(`📦 ${products.length} ürün bulundu\n`);

    // Her ürün için listingler oluştur
    for (const product of products) {
      console.log(`🏷️ ${product.name} için listingler oluşturuluyor...`);

      const basePrice = Math.floor(Math.random() * 50000) + 10000; // 10K-60K

      const platforms = [
        {
          name: 'Trendyol',
          price: basePrice + Math.floor(Math.random() * 5000),
          url: `https://trendyol.com/product/${product.id}`
        },
        {
          name: 'Amazon',
          price: basePrice + Math.floor(Math.random() * 7000),
          url: `https://amazon.com.tr/dp/${product.id}`
        },
        {
          name: 'Hepsiburada',
          price: basePrice + Math.floor(Math.random() * 6000),
          url: `https://hepsiburada.com/product/${product.id}`
        },
        {
          name: 'N11',
          price: basePrice + Math.floor(Math.random() * 4000),
          url: `https://n11.com/product/${product.id}`
        }
      ];

      for (const platform of platforms) {
        const listing = {
          productId: product.id,
          platform: platform.name,
          platformProductId: `${platform.name.toLowerCase()}-${Date.now()}`,
          url: platform.url,
          title: `${product.name} - ${platform.name}`,
          description: `${product.description} - ${platform.name}'da satışta`,
          price: platform.price,
          currency: 'TRY',
          originalPrice: platform.price + Math.floor(Math.random() * 10000),
          discount: Math.floor(Math.random() * 30) + 5,
          inStock: Math.random() > 0.1, // %90 stokta
          rating: 3.5 + Math.random() * 1.5,
          reviewCount: Math.floor(Math.random() * 1000) + 10
        };

        try {
          const response = await makeRequest('POST', '/api/listings', listing);
          if (response.status === 201) {
            console.log(`  ✅ ${platform.name}: ${platform.price.toLocaleString()} TL`);
          } else {
            console.log(`  ❌ ${platform.name}: ${response.data.error || 'Hata'}`);
          }
        } catch (error) {
          console.log(`  ❌ ${platform.name}: ${error.message}`);
        }
      }
      console.log('');
    }

    console.log('🎉 Listingler başarıyla oluşturuldu!\n');
    
    // Test et
    console.log('🔍 Test: Tüm listingleri getir...');
    const allListings = await makeRequest('GET', '/api/listings');
    if (allListings.data.success) {
      console.log(`✅ Toplam ${allListings.data.data.total} listing oluşturuldu`);
    }

  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

createListings();
