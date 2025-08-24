const { PrismaClient } = require('@prisma/client');

// Connection limit ile yeni client
const prisma = new PrismaClient();

async function simpleTest() {
  try {
    console.log('🔍 Basit bağlantı testi...');
    
    // Tablonun var olup olmadığını kontrol et
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Product'
      )
    `;
    
    console.log('✅ Product tablosu mevcut:', tableExists[0].exists);
    
  } catch (error) {
    console.error('❌ Bağlantı hatası:', error.message);
    
    // Farklı bir yaklaşım dene
    try {
      console.log('🔄 Alternatif bağlantı deneniyor...');
      await prisma.$disconnect();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Yeniden bağlan
      const simpleQuery = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Alternatif bağlantı başarılı');
      
    } catch (altError) {
      console.error('❌ Alternatif bağlantı da başarısız:', altError.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

simpleTest();
