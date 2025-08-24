const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProductsWithListings() {
  console.log('=== LİSTİNGİ OLAN ÜRÜNLER ===');
  
  const productsWithListings = await prisma.product.findMany({
    where: {
      listings: {
        some: {}
      }
    },
    include: {
      listings: true
    },
    take: 10
  });
  
  console.log(`Toplam ${productsWithListings.length} ürünün fiyat listingi var:`);
  
  productsWithListings.forEach((product, index) => {
    console.log(`\n${index + 1}. ${product.name} (${product.brand})`);
    console.log(`   Category: ${product.category}`);
    console.log(`   Listing sayısı: ${product.listings.length}`);
    console.log('   Platformlar:');
    const platforms = [...new Set(product.listings.map(l => l.platform))];
    platforms.forEach(platform => {
      const platformListings = product.listings.filter(l => l.platform === platform);
      const prices = platformListings.map(l => l.price);
      console.log(`     - ${platform}: ${prices.join(', ')} TL`);
    });
  });
  
  // iPhone'lara listing ekleyelim
  console.log('\n=== iPhone ÜRÜNLERE LİSTİNG EKLEYELİM ===');
  
  const iphones = await prisma.product.findMany({
    where: {
      name: { contains: 'iPhone', mode: 'insensitive' }
    }
  });
  
  for (const iphone of iphones) {
    console.log(`\n${iphone.name} için listing ekleniyor...`);
    
    // Rastgele platformlarda fiyatlar ekle
    const platforms = ['Amazon TR', 'Hepsiburada', 'Trendyol', 'Teknosa', 'Media Markt'];
    const randomPlatforms = platforms.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (const platform of randomPlatforms) {
      const price = Math.floor(Math.random() * 50000) + 10000; // 10K-60K arası
      
      await prisma.listing.create({
        data: {
          productId: iphone.id,
          platform: platform,
          price: price,
          url: `https://${platform.toLowerCase().replace(' ', '')}.com/${iphone.name.toLowerCase().replace(/\s/g, '-')}`
        }
      });
      
      console.log(`   ✅ ${platform}: ${price} TL`);
    }
  }
  
  await prisma.$disconnect();
}

checkProductsWithListings().catch(console.error);
