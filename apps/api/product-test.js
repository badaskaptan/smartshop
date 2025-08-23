// Product CRUD Test Script
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testProductCRUD() {
  console.log('🧪 Testing Product CRUD operations...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch('http://127.0.0.1:4000/health');
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    console.log('✅ Server is healthy\n');

    // Test 2: Create Product
    console.log('2️⃣ Testing product creation...');
    const newProduct = {
      name: 'iPhone 15 Pro Max 256GB',
      description: 'Latest iPhone with advanced camera system',
      category: 'Electronics',
      imageUrl: 'https://example.com/iphone15.jpg'
    };

    const createResponse = await fetch('http://127.0.0.1:4000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Product creation failed: ${createResponse.status} - ${errorText}`);
    }

    const createdProduct = await createResponse.json();
    console.log('✅ Product created:', {
      id: createdProduct.id,
      name: createdProduct.name,
      category: createdProduct.category
    });
    
    const productId = createdProduct.id;

    // Test 3: Get All Products
    console.log('\n3️⃣ Testing get all products...');
    const getAllResponse = await fetch('http://127.0.0.1:4000/api/products');
    
    if (!getAllResponse.ok) {
      throw new Error(`Get all products failed: ${getAllResponse.status}`);
    }

    const allProducts = await getAllResponse.json();
    console.log('✅ Retrieved products:', allProducts.length, 'products found');

    // Test 4: Get Single Product
    console.log('\n4️⃣ Testing get single product...');
    const getOneResponse = await fetch(`http://127.0.0.1:4000/api/products/${productId}`);
    
    if (!getOneResponse.ok) {
      throw new Error(`Get single product failed: ${getOneResponse.status}`);
    }

    const singleProduct = await getOneResponse.json();
    console.log('✅ Retrieved single product:', singleProduct.name);

    // Test 5: Update Product
    console.log('\n5️⃣ Testing product update...');
    const updateData = {
      name: 'iPhone 15 Pro Max 256GB - Updated',
      description: 'Latest iPhone with advanced camera system - Special Edition',
      category: 'Premium Electronics'
    };

    const updateResponse = await fetch(`http://127.0.0.1:4000/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Product update failed: ${updateResponse.status} - ${errorText}`);
    }

    const updatedProduct = await updateResponse.json();
    console.log('✅ Product updated:', updatedProduct.name);

    // Test 6: Search Products
    console.log('\n6️⃣ Testing product search...');
    const searchResponse = await fetch('http://127.0.0.1:4000/api/products/search?q=iPhone');
    
    if (!searchResponse.ok) {
      throw new Error(`Product search failed: ${searchResponse.status}`);
    }

    const searchResults = await searchResponse.json();
    console.log('✅ Search results:', searchResults.length, 'products found');

    // Test 7: Delete Product
    console.log('\n7️⃣ Testing product deletion...');
    const deleteResponse = await fetch(`http://127.0.0.1:4000/api/products/${productId}`, {
      method: 'DELETE'
    });

    if (!deleteResponse.ok) {
      throw new Error(`Product deletion failed: ${deleteResponse.status}`);
    }

    console.log('✅ Product deleted successfully');

    // Test 8: Verify Deletion
    console.log('\n8️⃣ Verifying deletion...');
    const verifyResponse = await fetch(`http://127.0.0.1:4000/api/products/${productId}`);
    
    if (verifyResponse.status === 404) {
      console.log('✅ Product deletion verified - 404 as expected');
    } else {
      throw new Error(`Product should be deleted but still exists`);
    }

    console.log('\n🎉 All Product CRUD tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Server health check');
    console.log('   ✅ Product creation (POST)');
    console.log('   ✅ Get all products (GET)');
    console.log('   ✅ Get single product (GET)');
    console.log('   ✅ Product update (PUT)');
    console.log('   ✅ Product search (GET with query)');
    console.log('   ✅ Product deletion (DELETE)');
    console.log('   ✅ Deletion verification');

  } catch (error) {
    console.error('\n❌ Product CRUD test failed:');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
  }
}

testProductCRUD();
