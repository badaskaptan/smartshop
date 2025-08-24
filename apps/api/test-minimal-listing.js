const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testMinimalListing() {
  try {
    console.log('🔍 Minimal listing test başlıyor...');
    
    // En temel field'larla test
    const testListing = await prisma.listing.create({
      data: {
        productId: "test-product-id-123",
        price: 100,
        platform: "TestPlatform",
        url: "https://test.com"
      }
    });
    
    console.log('✅ Minimal listing başarıyla oluşturuldu:', testListing);
    
    // Test listingini sil
    await prisma.listing.delete({
      where: { id: testListing.id }
    });
    
    console.log('✅ Test listing silindi');
    
  } catch (error) {
    console.error('❌ Minimal listing test hatası:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testMinimalListing();
