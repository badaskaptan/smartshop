const RealDataService = require('./services/RealDataService');

async function testPlatformField() {
    console.log('🧪 Platform field test başlıyor...');
    
    const service = new RealDataService();
    
    // Bir test ürünü bul
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
        const products = await prisma.product.findMany({ take: 1 });
        if (products.length > 0) {
            console.log(`🎯 Test için ürün: ${products[0].name}`);
            
            // Platform field'ı test et
            await service.createRealListings(products[0].id, 'test');
            console.log('✅ Platform field testi başarılı!');
        } else {
            console.log('❌ Test için ürün bulunamadı');
        }
    } catch (error) {
        console.error('❌ Platform field test hatası:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testPlatformField();
