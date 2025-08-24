const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('=== VERİTABANI İÇERİĞİ ===');
  
  const products = await prisma.product.findMany({
    take: 5,
    select: { id: true, name: true, brand: true }
  });
  console.log('İlk 5 Ürün:');
  products.forEach(p => console.log(`- ${p.name} (${p.brand})`));
  
  const listings = await prisma.listing.findMany({
    take: 10,
    select: { productId: true, platform: true, price: true, url: true }
  });
  console.log('\nİlk 10 Listing:');
  listings.forEach(l => console.log(`- ${l.platform}: ${l.price} TL (Product: ${l.productId})`));
  
  const platforms = await prisma.listing.groupBy({
    by: ['platform'],
    _count: { platform: true }
  });
  console.log('\nPlatform dağılımı:');
  platforms.forEach(p => console.log(`- ${p.platform}: ${p._count.platform} ürün`));
  
  // iPhone X için özel kontrol
  const iphoneX = await prisma.product.findFirst({
    where: { name: { contains: 'iPhone X' } },
    include: { listings: true }
  });
  
  if (iphoneX) {
    console.log('\n=== iPhone X Detayları ===');
    console.log(`ID: ${iphoneX.id}`);
    console.log(`İsim: ${iphoneX.name}`);
    console.log('Fiyatları:');
    iphoneX.listings.forEach(l => console.log(`- ${l.platform}: ${l.price} TL`));
  }
  
  await prisma.$disconnect();
}

checkData().catch(console.error);
