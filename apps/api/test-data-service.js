const ProductDataService = require('./services/ProductDataService');

async function testDataService() {
  const dataService = new ProductDataService();
  
  console.log('🚀 Otomatik veri çekme sistemi test ediliyor...\n');
  
  try {
    // Otomatik güncelleme çalıştır
    await dataService.autoUpdate();
    
    console.log('\n✅ Otomatik veri çekme tamamlandı!');
    
    // Test araması
    console.log('\n🔍 Örnek arama testi:');
    const searchResults = await dataService.scrapeAmazonLike('iPhone');
    console.log('Amazon benzeri siteden:', searchResults);
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

testDataService();
