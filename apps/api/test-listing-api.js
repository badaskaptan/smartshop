const http = require('http');

// Test data
const testProduct = {
  name: "iPhone 15 Pro 128GB",
  brand: "Apple",
  model: "iPhone 15 Pro",
  category: "Smartphone",
  description: "Apple iPhone 15 Pro 128GB Doğal Titanyum",
  imageUrl: "https://example.com/iphone15pro.jpg"
};

const testListing = {
  productId: "", // Will be filled after product creation
  platform: "Trendyol",
  platformProductId: "TY123456789",
  url: "https://www.trendyol.com/apple/iphone-15-pro-128gb-p-123456789",
  title: "Apple iPhone 15 Pro 128GB Doğal Titanyum",
  description: "Resmi Apple garantili, yeni nesil iPhone",
  price: 52999,
  currency: "TRY",
  originalPrice: 54999,
  discount: 4,
  rating: 4.8,
  reviewCount: 1250,
  inStock: true
};

// Create product first
function createProduct() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testProduct);
    
    const options = {
      hostname: '127.0.0.1',
      port: 4000,
      path: '/api/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          const result = JSON.parse(data);
          console.log('✅ Product created:', result.data.name);
          resolve(result.data.id);
        } else {
          console.error('❌ Failed to create product:', data);
          reject(new Error('Product creation failed'));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Create listing
function createListing(productId) {
  return new Promise((resolve, reject) => {
    testListing.productId = productId;
    const postData = JSON.stringify(testListing);
    
    const options = {
      hostname: '127.0.0.1',
      port: 4000,
      path: '/api/listings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          const result = JSON.parse(data);
          console.log('✅ Listing created:', result.data.platform, '-', result.data.price, 'TRY');
          resolve(result.data.id);
        } else {
          console.error('❌ Failed to create listing:', data);
          reject(new Error('Listing creation failed'));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Get listings
function getListings() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 4000,
      path: '/api/listings',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('✅ Listings retrieved:', result.data.listings.length, 'listings found');
          resolve(result);
        } else {
          console.error('❌ Failed to get listings:', data);
          reject(new Error('Get listings failed'));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Test price comparison
function testPriceComparison(productId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 4000,
      path: `/api/products/${productId}/price-comparison`,
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('✅ Price comparison:', result.data);
          resolve(result);
        } else {
          console.error('❌ Failed to get price comparison:', data);
          reject(new Error('Price comparison failed'));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    console.log('🧪 Testing SmartShop Listing Management API...\n');
    
    // 1. Create product
    console.log('1. Creating test product...');
    const productId = await createProduct();
    
    // 2. Create listing
    console.log('\n2. Creating test listing...');
    const listingId = await createListing(productId);
    
    // 3. Get listings
    console.log('\n3. Retrieving all listings...');
    await getListings();
    
    // 4. Test price comparison
    console.log('\n4. Testing price comparison...');
    await testPriceComparison(productId);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runTests();
