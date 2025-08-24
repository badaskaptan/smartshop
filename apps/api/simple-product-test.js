const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProducts() {
  try {
    console.log('🔍 Ürünleri listeleme testi...');
    
    // Basit product listesi
    const products = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ ${products.length} ürün bulundu:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.brand}`);
    });
    
    // Toplam sayı
    const total = await prisma.product.count();
    console.log(`📊 Toplam ürün sayısı: ${total}`);
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testProducts();
