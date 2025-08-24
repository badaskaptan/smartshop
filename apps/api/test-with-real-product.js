const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getProductIds() {
  try {
    console.log('🔍 Product IDleri aliniyor...');
    
    const products = await prisma.product.findMany({
      take: 1,
      select: { id: true, name: true }
    });
    
    if (products.length > 0) {
      const productId = products[0].id;
      console.log(`✅ Test için kullanılacak Product ID: ${productId}`);
      console.log(`📦 Product Name: ${products[0].name}`);
      
      // Şimdi listing oluşturmayı dene
      const testListing = await prisma.listing.create({
        data: {
          productId: productId,
          price: 100,
          platform: "TestPlatform",
          url: "https://test.com"
        }
      });
      
      console.log('✅ Test listing başarıyla oluşturuldu:', testListing.id);
      
      // Test listingini sil
      await prisma.listing.delete({
        where: { id: testListing.id }
      });
      
      console.log('✅ Test listing silindi');
      console.log('✅ Database field test başarılı!');
    }
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getProductIds();
