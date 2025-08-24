const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMoreProducts() {
  try {
    console.log('🎯 Daha fazla ürün ekleniyor...');
    
    const moreProducts = [
      // Televizyonlar
      {
        name: 'Samsung 55" QLED 4K Smart TV',
        brand: 'Samsung',
        model: 'QE55Q70C',
        category: 'Televizyon',
        description: 'Samsung 55 inç QLED 4K Smart TV - HDR10+ desteği'
      },
      {
        name: 'LG 65" OLED 4K Smart TV',
        brand: 'LG',
        model: 'OLED65C3',
        category: 'Televizyon',
        description: 'LG 65 inç OLED 4K Smart TV - AI ThinQ desteği'
      },
      
      // Akıllı Telefonlar
      {
        name: 'Google Pixel 8 Pro 256GB',
        brand: 'Google',
        model: 'Pixel 8 Pro',
        category: 'Telefon',
        description: 'Google Pixel 8 Pro 256GB - AI fotoğrafçılık'
      },
      {
        name: 'Xiaomi 13 Pro 256GB',
        brand: 'Xiaomi',
        model: '13 Pro',
        category: 'Telefon',
        description: 'Xiaomi 13 Pro 256GB - Snapdragon 8 Gen 2'
      },
      {
        name: 'OnePlus 11 128GB',
        brand: 'OnePlus',
        model: 'OnePlus 11',
        category: 'Telefon',
        description: 'OnePlus 11 128GB - Hasselblad kamera'
      },
      
      // Laptop'lar
      {
        name: 'HP Pavilion 15 i5',
        brand: 'HP',
        model: 'Pavilion 15',
        category: 'Laptop',
        description: 'HP Pavilion 15 Intel i5 8GB RAM 512GB SSD'
      },
      {
        name: 'Lenovo ThinkPad E14',
        brand: 'Lenovo',
        model: 'ThinkPad E14',
        category: 'Laptop',
        description: 'Lenovo ThinkPad E14 AMD Ryzen 5 16GB RAM'
      },
      {
        name: 'ASUS ROG Strix G15',
        brand: 'ASUS',
        model: 'ROG Strix G15',
        category: 'Laptop',
        description: 'ASUS ROG Strix G15 Gaming Laptop RTX 4060'
      },
      
      // Kulaklıklar
      {
        name: 'Apple AirPods Pro 2',
        brand: 'Apple',
        model: 'AirPods Pro 2',
        category: 'Kulaklık',
        description: 'Apple AirPods Pro 2 - Aktif Gürültü Engelleme'
      },
      {
        name: 'Bose QuietComfort 45',
        brand: 'Bose',
        model: 'QuietComfort 45',
        category: 'Kulaklık',
        description: 'Bose QuietComfort 45 Wireless Noise Cancelling'
      },
      {
        name: 'JBL Tune 760NC',
        brand: 'JBL',
        model: 'Tune 760NC',
        category: 'Kulaklık',
        description: 'JBL Tune 760NC Wireless Noise Cancelling'
      },
      
      // Akıllı Saatler
      {
        name: 'Apple Watch Series 9 45mm',
        brand: 'Apple',
        model: 'Watch Series 9',
        category: 'Akıllı Saat',
        description: 'Apple Watch Series 9 45mm GPS + Cellular'
      },
      {
        name: 'Samsung Galaxy Watch 6',
        brand: 'Samsung',
        model: 'Galaxy Watch 6',
        category: 'Akıllı Saat',
        description: 'Samsung Galaxy Watch 6 44mm Bluetooth'
      },
      
      // Tablet'ler
      {
        name: 'iPad Air 5th Gen 256GB',
        brand: 'Apple',
        model: 'iPad Air',
        category: 'Tablet',
        description: 'Apple iPad Air 5th Generation 256GB WiFi'
      },
      {
        name: 'Samsung Galaxy Tab S9',
        brand: 'Samsung',
        model: 'Galaxy Tab S9',
        category: 'Tablet',
        description: 'Samsung Galaxy Tab S9 128GB WiFi + S Pen'
      },
      
      // Gaming
      {
        name: 'PlayStation 5 Console',
        brand: 'Sony',
        model: 'PlayStation 5',
        category: 'Oyun Konsolu',
        description: 'Sony PlayStation 5 Console 825GB SSD'
      },
      {
        name: 'Xbox Series X',
        brand: 'Microsoft',
        model: 'Xbox Series X',
        category: 'Oyun Konsolu',
        description: 'Microsoft Xbox Series X 1TB Console'
      },
      
      // Ev Aletleri
      {
        name: 'Dyson V15 Detect',
        brand: 'Dyson',
        model: 'V15 Detect',
        category: 'Ev Aleti',
        description: 'Dyson V15 Detect Cordless Vacuum Cleaner'
      },
      {
        name: 'Xiaomi Robot Vacuum S10',
        brand: 'Xiaomi',
        model: 'Robot Vacuum S10',
        category: 'Ev Aleti',
        description: 'Xiaomi Robot Vacuum S10 with Auto-Empty'
      }
    ];
    
    let addedCount = 0;
    for (const product of moreProducts) {
      try {
        await prisma.product.create({
          data: {
            name: product.name,
            brand: product.brand,
            model: product.model,
            category: product.category,
            description: product.description,
            imageUrl: `https://example.com/${product.brand.toLowerCase()}-${product.model.toLowerCase().replace(/ /g, '-')}.jpg`
          }
        });
        console.log(`✅ ${product.name} eklendi`);
        addedCount++;
      } catch (error) {
        console.log(`⚠️ ${product.name} zaten mevcut, atlanıyor...`);
      }
    }
    
    console.log(`\n🎉 ${addedCount} yeni ürün eklendi!`);
    
    // Toplam ürün sayısını göster
    const total = await prisma.product.count();
    console.log(`📊 Toplam ürün sayısı: ${total}`);
    
    // Kategorilere göre dağılımı göster
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        _all: true
      }
    });
    
    console.log('\n📋 Kategori dağılımı:');
    categories.forEach(cat => {
      console.log(`• ${cat.category}: ${cat._count._all} ürün`);
    });
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreProducts();
