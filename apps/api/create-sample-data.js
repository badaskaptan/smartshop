const http = require('http');

const API_BASE = 'http://127.0.0.1:4000';

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

async function createSampleData() {
  console.log('🚀 SmartShop için test verileri oluşturuluyor...\n');

  const sampleProducts = [
    {
      name: 'iPhone 15 Pro 128GB Titanium',
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      category: 'Telefon',
      description: 'Apple iPhone 15 Pro 128GB Titanium - En son A17 Pro chip ile',
      imageUrl: 'https://example.com/iphone15pro.jpg'
    },
    {
      name: 'Samsung Galaxy S24 Ultra 256GB',
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      category: 'Telefon',
      description: 'Samsung Galaxy S24 Ultra 256GB - S Pen dahil',
      imageUrl: 'https://example.com/galaxys24ultra.jpg'
    },
    {
      name: 'MacBook Air M3 13" 256GB',
      brand: 'Apple',
      model: 'MacBook Air',
      category: 'Laptop',
      description: 'Apple MacBook Air 13" M3 Chip 8GB RAM 256GB SSD',
      imageUrl: 'https://example.com/macbookair.jpg'
    },
    {
      name: 'Dell XPS 13 Plus',
      brand: 'Dell',
      model: 'XPS 13 Plus',
      category: 'Laptop',
      description: 'Dell XPS 13 Plus 12th Gen Intel i7 16GB RAM 512GB SSD',
      imageUrl: 'https://example.com/dellxps13.jpg'
    },
    {
      name: 'Sony WH-1000XM5 Kulaklık',
      brand: 'Sony',
      model: 'WH-1000XM5',
      category: 'Kulaklık',
      description: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      imageUrl: 'https://example.com/sony-headphones.jpg'
    }
  ];

  let createdProducts = [];

  // Ürünleri oluştur
  for (const product of sampleProducts) {
    try {
      console.log(`📦 ${product.name} oluşturuluyor...`);
      const response = await makeRequest('POST', '/api/products', product);
      
      if (response.status === 201 && response.data.success) {
        createdProducts.push(response.data.data);
        console.log(`✅ Ürün oluşturuldu - ID: ${response.data.data.id}`);
      } else {
        console.log(`❌ Ürün oluşturulamadı:`, response.data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.log(`❌ Hata: ${error.message}`);
    }
  }

  console.log(`\n🎯 ${createdProducts.length} ürün başarıyla oluşturuldu!\n`);

  // Her ürün için platform listingleri oluştur
  for (const product of createdProducts) {
    console.log(`🏷️ ${product.name} için listingler oluşturuluyor...`);

    // Random fiyatlar
    const basePrice = Math.floor(Math.random() * 50000) + 5000; // 5K-55K arası
    
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
        platformProductId: `${platform.name.toLowerCase()}-${product.id}`,
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
        if (response.status === 201 && response.data.success) {
          console.log(`  ✅ ${platform.name}: ${platform.price.toLocaleString()} TL`);
        } else {
          console.log(`  ❌ ${platform.name}: ${response.data.error || 'Hata'}`);
        }
      } catch (error) {
        console.log(`  ❌ ${platform.name}: ${error.message}`);
      }
    }
  }

  console.log('\n🎉 Test verileri başarıyla oluşturuldu!');
  console.log('\n📱 Frontend\'i test etmek için:');
  console.log('   🌐 http://localhost:3000/price-comparison-app.html');
  console.log('\n📊 API\'yi test etmek için:');
  console.log('   🔍 http://127.0.0.1:4000/api/products');
  console.log('   🏷️ http://127.0.0.1:4000/api/listings');
}

createSampleData();
