const fetch = require('node-fetch');

async function testSearch() {
  try {
    const response = await fetch('http://127.0.0.1:4000/api/products?q=iPhone');
    const data = await response.json();
    
    console.log('=== iPhone ARAMA SONUÇLARI ===');
    console.log(`Toplam: ${data.products.length} ürün`);
    
    data.products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Brand: ${product.brand}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   ID: ${product.id}`);
    });
    
    // İlk ürün için fiyat karşılaştırma test et
    if (data.products.length > 0) {
      const firstProduct = data.products[0];
      console.log(`\n=== ${firstProduct.name} FIYAT KARŞILAŞTIRMA ===`);
      
      const priceResponse = await fetch(`http://127.0.0.1:4000/api/products/${firstProduct.id}/price-comparison`);
      const priceData = await priceResponse.json();
      
      console.log('Price comparison response:', JSON.stringify(priceData, null, 2));
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testSearch();
