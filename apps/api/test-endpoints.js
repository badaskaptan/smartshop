const http = require('http');

const API_PORT = 4001; // Updated port

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    // Update port in options
    options.port = API_PORT;
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

async function testEndpoints() {
  console.log('🧪 Testing SmartShop API Endpoints...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing /health endpoint...');
    const healthResponse = await makeRequest({
      hostname: '127.0.0.1',
      port: 4001,
      path: '/health',
      method: 'GET'
    });
    console.log(`✅ Health check: ${healthResponse.status} - ${JSON.stringify(healthResponse.data)}\n`);
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}\n`);
    return;
  }

  // Test 2: Root endpoint
  try {
    console.log('2. Testing / endpoint...');
    const rootResponse = await makeRequest({
      hostname: '127.0.0.1',
      port: 4000,
      path: '/',
      method: 'GET'
    });
    console.log(`✅ Root endpoint: ${rootResponse.status}`);
    console.log(`   API name: ${rootResponse.data.name}`);
    console.log(`   Listing endpoints available: ${Object.keys(rootResponse.data.endpoints.listings).length}\n`);
  } catch (error) {
    console.log(`❌ Root endpoint failed: ${error.message}\n`);
  }

  // Test 3: Products endpoint
  try {
    console.log('3. Testing /api/products endpoint...');
    const productsResponse = await makeRequest({
      hostname: '127.0.0.1',
      port: 4000,
      path: '/api/products',
      method: 'GET'
    });
    console.log(`✅ Products list: ${productsResponse.status} - Found ${productsResponse.data.data?.length || 0} products\n`);
  } catch (error) {
    console.log(`❌ Products endpoint failed: ${error.message}\n`);
  }

  // Test 4: Listings endpoint
  try {
    console.log('4. Testing /api/listings endpoint...');
    const listingsResponse = await makeRequest({
      hostname: '127.0.0.1',
      port: 4000,
      path: '/api/listings',
      method: 'GET'
    });
    console.log(`✅ Listings list: ${listingsResponse.status}`);
    if (listingsResponse.data.success) {
      console.log(`   Found ${listingsResponse.data.data?.listings?.length || 0} listings`);
      console.log(`   Total: ${listingsResponse.data.data?.total || 0}\n`);
    } else {
      console.log(`   Response: ${JSON.stringify(listingsResponse.data)}\n`);
    }
  } catch (error) {
    console.log(`❌ Listings endpoint failed: ${error.message}\n`);
  }

  // Test 5: Create a sample product
  try {
    console.log('5. Testing product creation...');
    const newProduct = {
      name: 'Test Product',
      brand: 'Test Brand',
      model: 'Test Model',
      category: 'Electronics',
      description: 'Test description',
      imageUrl: 'https://example.com/image.jpg'
    };

    const createProductResponse = await makeRequest({
      hostname: '127.0.0.1',
      port: 4000,
      path: '/api/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, newProduct);

    console.log(`✅ Product creation: ${createProductResponse.status}`);
    if (createProductResponse.data.success) {
      const productId = createProductResponse.data.data.id;
      console.log(`   Created product ID: ${productId}\n`);
      
      // Test 6: Create a listing for this product
      console.log('6. Testing listing creation...');
      const newListing = {
        productId: productId,
        platform: 'Trendyol',
        platformProductId: 'test-123',
        url: 'https://trendyol.com/test-product',
        title: 'Test Product Listing',
        description: 'Test listing description',
        price: 99.99,
        currency: 'TRY',
        originalPrice: 120.00,
        discount: 17,
        inStock: true
      };

      const createListingResponse = await makeRequest({
        hostname: '127.0.0.1',
        port: 4000,
        path: '/api/listings',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, newListing);

      console.log(`✅ Listing creation: ${createListingResponse.status}`);
      if (createListingResponse.data.success) {
        console.log(`   Created listing ID: ${createListingResponse.data.data.id}`);
        
        // Test 7: Get price comparison
        console.log('\n7. Testing price comparison...');
        const priceComparisonResponse = await makeRequest({
          hostname: '127.0.0.1',
          port: 4000,
          path: `/api/products/${productId}/price-comparison`,
          method: 'GET'
        });
        
        console.log(`✅ Price comparison: ${priceComparisonResponse.status}`);
        if (priceComparisonResponse.data.success) {
          const comparison = priceComparisonResponse.data.data;
          console.log(`   Product: ${comparison.productName}`);
          console.log(`   Lowest price: ${comparison.lowestPrice.price} ${comparison.lowestPrice.currency} on ${comparison.lowestPrice.platform}`);
          console.log(`   Platform count: ${comparison.platformCount}`);
        }
      } else {
        console.log(`   Error: ${JSON.stringify(createListingResponse.data)}`);
      }
    } else {
      console.log(`   Error: ${JSON.stringify(createProductResponse.data)}`);
    }
  } catch (error) {
    console.log(`❌ Product/Listing creation failed: ${error.message}`);
  }

  console.log('\n🎉 API testing completed!');
}

testEndpoints();
