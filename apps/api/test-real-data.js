// Gerçek veri test scripti
const RealDataService = require('./services/RealDataService');

async function testRealData() {
  const realService = new RealDataService();
  
  console.log('🎯 GERÇEK VERİ SİSTEMİ TESTİ\n');
  
  // 1. Önce statik verileri temizle
  console.log('🧹 1. Statik verileri temizliyorum...');
  await realService.clearStaticData();
  
  // 2. Gerçek ürün aramaları
  const searchTerms = [
    'smartphone',
    'laptop', 
    'perfume',
    'shoes',
    'watch'
  ];
  
  let totalRealProducts = 0;
  
  for (const term of searchTerms) {
    console.log(`\n🔍 "${term}" için gerçek veri aranıyor...`);
    const result = await realService.comprehensiveSearch(term);
    totalRealProducts += result.totalAdded;
    
    // Kısa bekleme (API rate limit için)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ TOPLAM ${totalRealProducts} GERÇEK ÜRÜN EKLENDİ!`);
  
  // 3. Sonuçları kontrol et
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  const total = await prisma.product.count();
  console.log(`📊 Veritabanında toplam ${total} ürün`);
  
  // 4. Kategorilere göre dağılım
  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: {
      _all: true
    }
  });
  
  console.log('\n📋 Kategori dağılımı (GERÇEK VERİ):');
  categories.forEach(cat => {
    console.log(`• ${cat.category}: ${cat._count._all} ürün`);
  });
  
  // 5. Örnek ürünleri göster
  const sampleProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('\n🆕 Son eklenen gerçek ürünler:');
  sampleProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name} - ${product.brand}`);
  });
  
  await prisma.$disconnect();
}

testRealData().catch(console.error);
