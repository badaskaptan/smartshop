// Dinamik arama endpoint'i
const DynamicProductSearch = require('../../services/DynamicProductSearch');
const RealDataService = require('../../services/RealDataService');

export async function dynamicSearchRoutes(fastify: any) {
  const searchService = new DynamicProductSearch();
  const realDataService = new RealDataService();

  // GERÇEK VERİ ARAMA (YENİ!)
  fastify.post('/api/real-search', async (request: any, reply: any) => {
    try {
      const { searchTerm } = request.body;
      
      if (!searchTerm) {
        return reply.status(400).send({ 
          error: 'searchTerm gerekli' 
        });
      }

      console.log(`🔍 GERÇEK API'lerden "${searchTerm}" aranıyor...`);
      
      const result = await realDataService.comprehensiveSearch(searchTerm);
      
      return reply.send({
        success: true,
        searchTerm: result.searchTerm,
        totalAdded: result.totalAdded,
        products: result.products,
        source: result.source,
        message: `"${searchTerm}" için ${result.totalAdded} GERÇEK ürün eklendi`,
        dataType: 'REAL_API_DATA'
      });
      
    } catch (error) {
      console.error('Gerçek veri arama hatası:', error);
      return reply.status(500).send({
        error: 'Gerçek veri arama sırasında hata oluştu',
        details: (error as Error).message
      });
    }
  });

  // Statik verileri temizleme
  fastify.post('/api/clean-static', async (request: any, reply: any) => {
    try {
      console.log('🧹 Statik veriler temizleniyor...');
      
      await realDataService.clearStaticData();
      
      return reply.send({
        success: true,
        message: 'Statik test verileri temizlendi, sadece gerçek veriler kaldı'
      });
      
    } catch (error) {
      console.error('Veri temizleme hatası:', error);
      return reply.status(500).send({
        error: 'Veri temizleme sırasında hata oluştu',
        details: (error as Error).message
      });
    }
  });

  // Dinamik ürün arama ve ekleme
  fastify.post('/api/search-and-add', async (request: any, reply: any) => {
    try {
      const { searchTerm } = request.body;
      
      if (!searchTerm) {
        return reply.status(400).send({ 
          error: 'searchTerm gerekli' 
        });
      }

      console.log(`🔍 API üzerinden "${searchTerm}" aranıyor...`);
      
      const result = await searchService.searchAndAdd(searchTerm);
      
      return reply.send({
        success: true,
        searchTerm: result.searchTerm,
        totalAdded: result.totalAdded,
        products: result.results,
        message: `"${searchTerm}" için ${result.totalAdded} yeni ürün eklendi`
      });
      
    } catch (error) {
      console.error('Dinamik arama hatası:', error);
      return reply.status(500).send({
        error: 'Arama sırasında hata oluştu',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Toplu arama
  fastify.post('/api/bulk-search', async (request: any, reply: any) => {
    try {
      const { searchTerms } = request.body;
      
      if (!searchTerms || !Array.isArray(searchTerms)) {
        return reply.status(400).send({ 
          error: 'searchTerms array gerekli' 
        });
      }

      console.log(`🔍 Toplu arama: ${searchTerms.join(', ')}`);
      
      const result = await searchService.bulkSearch(searchTerms);
      
      return reply.send({
        success: true,
        searchTerms,
        totalAdded: result.totalAdded,
        results: result.results,
        message: `${searchTerms.length} terim için ${result.totalAdded} yeni ürün eklendi`
      });
      
    } catch (error) {
      console.error('Toplu arama hatası:', error);
      return reply.status(500).send({
        error: 'Toplu arama sırasında hata oluştu',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
