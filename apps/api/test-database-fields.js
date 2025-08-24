const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabaseFields() {
  try {
    console.log('🔍 Database field test başlıyor...');
    
    // Mevcut database'de hangi field'lar var? Test edelim
    const testListing = await prisma.listing.create({
      data: {
        productId: "test-product-id-123",
        price: 100,
        platform: "TestPlatform",
        url: "https://test.com",
        lastUpdated: new Date()
      }
    });
    
    console.log('✅ Listing başarıyla oluşturuldu:', testListing);
    
    // Test listingini sil
    await prisma.listing.delete({
      where: { id: testListing.id }
    });
    
    console.log('✅ Test listing silindi');
    
  } catch (error) {
    console.error('❌ Database field test hatası:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseFields();
