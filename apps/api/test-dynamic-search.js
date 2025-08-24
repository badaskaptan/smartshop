// Dinamik arama test scripti
const DynamicProductSearch = require('./services/DynamicProductSearch');

async function testDynamicSearch() {
  const searchService = new DynamicProductSearch();
  
  console.log('🎯 Dinamik ürün arama test ediliyor...\n');
  
  // Tek terim arama
  console.log('📱 1. "telefon" aranıyor...');
  await searchService.searchAndAdd('telefon');
  
  console.log('\n💻 2. "laptop" aranıyor...');
  await searchService.searchAndAdd('laptop');
  
  console.log('\n👕 3. "shirt" aranıyor...');
  await searchService.searchAndAdd('shirt');
  
  // Toplu arama
  console.log('\n🔍 4. Toplu arama testi...');
  await searchService.bulkSearch(['watch', 'camera', 'headphones']);
  
  console.log('\n✅ Test tamamlandı!');
}

testDynamicSearch().catch(console.error);
