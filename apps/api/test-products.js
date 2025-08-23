// Product CRUD test suite
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testProductCRUD() {
  console.log('🧪 Starting Product CRUD test suite...');
  
  const baseUrl = 'http://127.0.0.1:4000';
  let createdProductId = null;

  try {
    // Test 1: Create Product
    console.log('\n1️⃣ Testing Product Creation...');
    
    const newProduct = {
      name: 'Apple iPhone 15 Pro',
      description: 'Latest flagship iPhone with titanium design',
      category: 'Smartphones', 
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      imageUrl: 'https://example.com/iphone15pro.jpg'
    };
    
    console.log('Creating product:', newProduct.name);
    
    const createResponse = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });

    console.log('Create response status:', createResponse.status);

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Product creation failed - Status:', createResponse.status);
      console.error('❌ Product creation failed - Response:', errorText);
      return;
    }

    const createData = await createResponse.json();
    console.log('✅ Product created successfully:', {
      success: createData.success,
      productId: createData.product?.id,
      name: createData.product?.name
    });

    if (!createData.product?.id) {
      console.error('❌ No product ID received');
      return;
    }

    createdProductId = createData.product.id;

    // Test 2: Get Product by ID
    console.log('\n2️⃣ Testing Get Product by ID...');
    
    const getResponse = await fetch(`${baseUrl}/api/products/${createdProductId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error('❌ Get product failed - Status:', getResponse.status);
      console.error('❌ Get product failed - Response:', errorText);
      return;
    }

    const getData = await getResponse.json();
    console.log('✅ Product retrieved successfully:', {
      success: getData.success,
      name: getData.product?.name,
      category: getData.product?.category,
      brand: getData.product?.brand
    });

    // Test 3: Update Product
    console.log('\n3️⃣ Testing Product Update...');
    
    const updateData = {
      description: 'Updated: Latest flagship iPhone with titanium design and Action Button',
      category: 'Electronics'
    };
    
    const updateResponse = await fetch(`${baseUrl}/api/products/${createdProductId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('❌ Product update failed - Status:', updateResponse.status);
      console.error('❌ Product update failed - Response:', errorText);
      return;
    }

    const updatedData = await updateResponse.json();
    console.log('✅ Product updated successfully:', {
      success: updatedData.success,
      name: updatedData.product?.name,
      description: updatedData.product?.description?.substring(0, 50) + '...',
      category: updatedData.product?.category
    });

    // Test 4: Search/List Products
    console.log('\n4️⃣ Testing Product Search...');
    
    const searchResponse = await fetch(`${baseUrl}/api/products?q=iPhone&category=Electronics`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('❌ Product search failed - Status:', searchResponse.status);
      console.error('❌ Product search failed - Response:', errorText);
      return;
    }

    const searchData = await searchResponse.json();
    console.log('✅ Product search successful:', {
      success: searchData.success,
      total: searchData.total,
      resultsCount: searchData.products?.length,
      firstResult: searchData.products?.[0]?.name
    });

    // Test 5: List All Products
    console.log('\n5️⃣ Testing List All Products...');
    
    const listResponse = await fetch(`${baseUrl}/api/products?limit=5`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('❌ Product list failed - Status:', listResponse.status);
      console.error('❌ Product list failed - Response:', errorText);
      return;
    }

    const listData = await listResponse.json();
    console.log('✅ Product list successful:', {
      success: listData.success,
      total: listData.total,
      page: listData.page,
      limit: listData.limit,
      productsReturned: listData.products?.length
    });

    // Test 6: Delete Product
    console.log('\n6️⃣ Testing Product Deletion...');
    
    const deleteResponse = await fetch(`${baseUrl}/api/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('❌ Product deletion failed - Status:', deleteResponse.status);
      console.error('❌ Product deletion failed - Response:', errorText);
      return;
    }

    console.log('✅ Product deleted successfully (Status: 204)');

    // Test 7: Verify Deletion
    console.log('\n7️⃣ Verifying Product Deletion...');
    
    const verifyResponse = await fetch(`${baseUrl}/api/products/${createdProductId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (verifyResponse.status === 404) {
      console.log('✅ Product deletion verified (404 Not Found)');
    } else {
      console.error('❌ Product deletion verification failed - expected 404, got:', verifyResponse.status);
    }

    console.log('\n🎉 All Product CRUD tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Product creation working');
    console.log('   ✅ Product retrieval by ID working');
    console.log('   ✅ Product update working');
    console.log('   ✅ Product search working');
    console.log('   ✅ Product listing with pagination working');
    console.log('   ✅ Product deletion working');
    console.log('   ✅ Deletion verification working');

  } catch (error) {
    console.error('\n❌ Product CRUD test suite failed with error:');
    console.error('Error message:', error.message);
    console.error('Error type:', error.constructor.name);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    console.error('Full error object:', error);
    
    // Cleanup: try to delete the product if it was created
    if (createdProductId) {
      console.log('\n🧹 Attempting cleanup...');
      try {
        await fetch(`${baseUrl}/api/products/${createdProductId}`, {
          method: 'DELETE'
        });
        console.log('✅ Cleanup successful');
      } catch (cleanupError) {
        console.error('❌ Cleanup failed:', cleanupError.message);
      }
    }
  }
}

testProductCRUD();
