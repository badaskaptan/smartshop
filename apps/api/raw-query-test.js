const { PrismaClient } = require('@prisma/client');

// Yeni bir client instance oluştur
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function resetAndCreateProducts() {
  try {
    console.log('🔧 Veritabanı bağlantısını test ediyoruz...');
    
    // Önce basit bir raw query ile test edelim
    const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Product"`;
    console.log('✅ Veritabanı bağlantısı başarılı');
    console.log('📊 Mevcut ürün sayısı:', result[0].count);
    
    // Eğer ürün yoksa örnek ürünler oluştur
    if (parseInt(result[0].count) === 0) {
      console.log('📝 Örnek ürünler oluşturuluyor...');
      
      const products = [
        {
          name: 'iPhone 15 Pro 128GB Titanium',
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          category: 'Telefon',
          description: 'Apple iPhone 15 Pro 128GB Doğal Titanyum'
        },
        {
          name: 'Samsung Galaxy S24 Ultra 256GB',
          brand: 'Samsung',
          model: 'Galaxy S24 Ultra',
          category: 'Telefon',
          description: 'Samsung Galaxy S24 Ultra 256GB Phantom Black'
        },
        {
          name: 'MacBook Air M3 13" 256GB',
          brand: 'Apple',
          model: 'MacBook Air M3',
          category: 'Laptop',
          description: 'Apple MacBook Air 13" M3 256GB Gece Yarısı'
        }
      ];
      
      for (const product of products) {
        await prisma.$executeRaw`
          INSERT INTO "Product" (name, brand, model, category, description, "createdAt", "updatedAt")
          VALUES (${product.name}, ${product.brand}, ${product.model}, ${product.category}, ${product.description}, NOW(), NOW())
        `;
        console.log(`✅ ${product.name} oluşturuldu`);
      }
    }
    
    // Ürünleri listele
    const products = await prisma.$queryRaw`SELECT * FROM "Product" ORDER BY "createdAt" DESC LIMIT 5`;
    console.log('\n🎯 Ürün listesi:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.brand}`);
    });
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndCreateProducts();
