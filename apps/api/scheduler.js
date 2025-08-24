// Otomatik veri güncelleme scheduler'ı
const cron = require('node-cron');
const ProductDataService = require('./services/ProductDataService');

class DataUpdateScheduler {
  constructor() {
    this.dataService = new ProductDataService();
    this.isRunning = false;
  }

  // Her gün saat 02:00'da otomatik güncelleme
  startDailyUpdate() {
    console.log('📅 Günlük otomatik güncelleme programlandı (02:00)');
    
    cron.schedule('0 2 * * *', async () => {
      console.log('🌅 Günlük otomatik güncelleme başlatılıyor...');
      await this.runUpdate();
    });
  }

  // Her 6 saatte bir güncelleme
  startPeriodicUpdate() {
    console.log('⏰ 6 saatlik periyodik güncelleme programlandı');
    
    cron.schedule('0 */6 * * *', async () => {
      console.log('🔄 Periyodik güncelleme başlatılıyor...');
      await this.runUpdate();
    });
  }

  // Manuel güncelleme tetikleme
  async runUpdate() {
    if (this.isRunning) {
      console.log('⚠️ Güncelleme zaten çalışıyor, atlanıyor...');
      return;
    }

    this.isRunning = true;
    
    try {
      console.log('🚀 Veri güncelleme başlatıldı:', new Date().toLocaleString('tr-TR'));
      
      const result = await this.dataService.autoUpdate();
      
      console.log(`✅ Güncelleme tamamlandı: ${result} yeni ürün eklendi`);
      console.log('📊 Güncelleme zamanı:', new Date().toLocaleString('tr-TR'));
      
    } catch (error) {
      console.error('❌ Güncelleme hatası:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  // Test için hızlı güncelleme (her dakika)
  startTestUpdate() {
    console.log('🧪 Test modu: Her dakika güncelleme');
    
    cron.schedule('* * * * *', async () => {
      console.log('🧪 Test güncelleme:', new Date().toLocaleString('tr-TR'));
      await this.runUpdate();
    });
  }
}

// Eğer bu dosya direkt çalıştırılırsa
if (require.main === module) {
  const scheduler = new DataUpdateScheduler();
  
  console.log('🎯 Otomatik veri güncelleme servisi başlatılıyor...\n');
  
  // Günlük güncelleme programla
  scheduler.startDailyUpdate();
  
  // Periyodik güncelleme programla
  scheduler.startPeriodicUpdate();
  
  // İlk güncellemeyi hemen çalıştır
  console.log('🏁 İlk güncelleme başlatılıyor...\n');
  scheduler.runUpdate();
  
  console.log('✅ Scheduler çalışıyor. CTRL+C ile durdurun.\n');
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Scheduler durduruluyor...');
    process.exit(0);
  });
}

module.exports = DataUpdateScheduler;
