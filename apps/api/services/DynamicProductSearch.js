// Dinamik ürün arama ve ekleme servisi
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class DynamicProductSearch {
  constructor() {
    this.searchSources = {
      fakestore: 'https://fakestoreapi.com/products',
      // Gerçek API'ler için endpoints
      ebay: 'https://api.ebay.com/buy/browse/v1/item_summary/search',
      amazon: 'https://api.amazon.com/products/search', // Örnek
    };
  }

  // Kullanıcının aradığı terimi otomatik olarak bulup ekle
  async searchAndAdd(searchTerm) {
    console.log(`🔍 "${searchTerm}" aranıyor ve ekleniyor...`);
    
    let totalAdded = 0;
    const results = [];

    try {
      // 1. Fake Store API'den ara
      const fakeStoreResults = await this.searchFakeStore(searchTerm);
      totalAdded += fakeStoreResults.added;
      results.push(...fakeStoreResults.products);

      // 2. Simülasyon API'lerden ara
      const simulatedResults = await this.simulateProductSearch(searchTerm);
      totalAdded += simulatedResults.added;
      results.push(...simulatedResults.products);

      console.log(`✅ "${searchTerm}" için ${totalAdded} yeni ürün eklendi!`);
      
      return {
        searchTerm,
        totalAdded,
        results
      };

    } catch (error) {
      console.error(`❌ "${searchTerm}" arama hatası:`, error.message);
      return { searchTerm, totalAdded: 0, results: [] };
    }
  }

  // Fake Store API'de arama
  async searchFakeStore(searchTerm) {
    try {
      const response = await axios.get(this.searchSources.fakestore);
      const allProducts = response.data;
      
      // Arama terimini içeren ürünleri filtrele
      const matchingProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log(`📦 Fake Store'da ${matchingProducts.length} eşleşen ürün bulundu`);

      let added = 0;
      const products = [];

      for (const product of matchingProducts) {
        try {
          const categoryMap = {
            "men's clothing": "Erkek Giyim",
            "women's clothing": "Kadın Giyim", 
            "jewelery": "Takı",
            "electronics": "Elektronik"
          };

          const newProduct = await prisma.product.create({
            data: {
              name: product.title,
              brand: this.extractBrand(product.title),
              model: this.extractModel(product.title),
              category: categoryMap[product.category] || product.category,
              description: product.description,
              imageUrl: product.image
            }
          });
          
          products.push(newProduct);
          added++;
          console.log(`✅ ${product.title} eklendi`);
          
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`⚠️ ${product.title} zaten mevcut`);
          }
        }
      }

      return { added, products };
      
    } catch (error) {
      console.error('❌ Fake Store arama hatası:', error.message);
      return { added: 0, products: [] };
    }
  }

  // Simülasyon: Gerçek API'ler için örnek
  async simulateProductSearch(searchTerm) {
    console.log(`🎭 "${searchTerm}" için simülasyon ürünleri oluşturuluyor...`);
    
    const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'HP', 'Dell', 'Nike', 'Adidas', 'Zara', 'H&M'];
    const categories = ['Elektronik', 'Giyim', 'Ev Aleti', 'Spor', 'Kitap', 'Oyun'];
    
    // Arama terimine göre akıllı ürün oluştur
    const simulatedProducts = [];
    
    for (let i = 0; i < 3; i++) {
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      simulatedProducts.push({
        name: `${randomBrand} ${searchTerm} ${['Pro', 'Plus', 'Max', 'Ultra', 'Premium'][i]}`,
        brand: randomBrand,
        category: randomCategory,
        description: `${randomBrand} markasından ${searchTerm} ürünü - yüksek kalite`,
        price: Math.floor(Math.random() * 2000) + 100
      });
    }

    let added = 0;
    const products = [];

    for (const product of simulatedProducts) {
      try {
        const newProduct = await prisma.product.create({
          data: {
            name: product.name,
            brand: product.brand,
            model: this.extractModel(product.name),
            category: product.category,
            description: product.description,
            imageUrl: `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`
          }
        });
        
        products.push(newProduct);
        added++;
        console.log(`✅ ${product.name} eklendi`);
        
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ ${product.name} zaten mevcut`);
        }
      }
    }

    return { added, products };
  }

  // Marka çıkarma
  extractBrand(title) {
    const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'HP', 'Dell', 'Lenovo', 'ASUS', 'Microsoft', 'Google', 'Xiaomi', 'OnePlus'];
    for (const brand of brands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
    return 'Bilinmeyen Marka';
  }

  // Model çıkarma
  extractModel(title) {
    const words = title.split(' ');
    return words.slice(1, 3).join(' ') || 'Standart Model';
  }

  // Toplu arama - birden fazla terim
  async bulkSearch(searchTerms) {
    console.log(`🔍 Toplu arama başlatılıyor: ${searchTerms.join(', ')}`);
    
    const results = [];
    let totalAdded = 0;

    for (const term of searchTerms) {
      const result = await this.searchAndAdd(term);
      results.push(result);
      totalAdded += result.totalAdded;
      
      // API rate limit için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`🎉 Toplu arama tamamlandı: ${totalAdded} yeni ürün eklendi`);
    return { totalAdded, results };
  }
}

module.exports = DynamicProductSearch;
