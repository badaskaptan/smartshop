const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testIPhoneData() {
  console.log('=== iPhone ÜRÜN ANALİZİ ===');
  
  // iPhone ile başlayan tüm ürünleri bul
  const iphones = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'iPhone', mode: 'insensitive' } },
        { name: { contains: 'iphone', mode: 'insensitive' } }
      ]
    },
    include: {
      listings: true
    }
  });
  
  console.log(`Toplam ${iphones.length} iPhone ürünü bulundu:`);
  
  iphones.forEach((phone, index) => {
    console.log(`\n${index + 1}. ${phone.name}`);
    console.log(`   Brand: ${phone.brand}`);
    console.log(`   Category: ${phone.category}`);
    console.log(`   ID: ${phone.id}`);
    console.log(`   Listing sayısı: ${phone.listings.length}`);
    
    if (phone.listings.length > 0) {
      console.log('   Fiyatları:');
      phone.listings.forEach(listing => {
        console.log(`     - ${listing.platform}: ${listing.price} TL`);
      });
    } else {
      console.log('   ❌ Hiç fiyat listingi yok!');
    }
  });
  
  await prisma.$disconnect();
}

testIPhoneData().catch(console.error);
