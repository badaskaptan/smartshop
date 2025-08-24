// Dinamik arama testi
async function testDynamicSearchAPI() {
  const API_BASE = 'http://localhost:4000';
  
  console.log('🎯 Frontend dinamik arama testi...\n');
  
  // Test 1: Tek arama
  console.log('📱 1. gaming ariyoruz...');
  try {
    const response = await fetch(`${API_BASE}/api/search-and-add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchTerm: 'gaming'
      })
    });
    
    const result = await response.json();
    console.log('✅ Sonuç:', result);
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  // Test 2: Toplu arama
  console.log('\n🔍 2. Toplu arama: shoes, book, music');
  try {
    const response = await fetch(`${API_BASE}/api/bulk-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchTerms: ['shoes', 'book', 'music']
      })
    });
    
    const result = await response.json();
    console.log('✅ Sonuç:', result);
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  // Test 3: Ürün sayısını kontrol et
  console.log('\n📊 3. Toplam ürün sayısını kontrol ediyoruz...');
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    const products = await response.json();
    console.log(`✅ Şu anda ${products.length} ürün var!`);
    
    // Son eklenen 5 ürünü göster
    const lastProducts = products.slice(-5);
    console.log('\n🆕 Son eklenen ürünler:');
    lastProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.brand}`);
    });
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

testDynamicSearchAPI();
