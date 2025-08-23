import { PrismaClient } from '@prisma/client';

export class ListingService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['error'],
    });
  }

  async createListing(data: {
    productId: string;
    platform: string;
    platformProductId?: string;
    price: number;
    currency?: string;
    url?: string;
    inStock?: boolean;
    title?: string;
    description?: string;
  }) {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: data.productId },
      });

      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      // Check if listing already exists for this product and platform
      const existingListing = await this.prisma.listing.findFirst({
        where: {
          productId: data.productId,
          platform: data.platform,
        },
      });

      if (existingListing) {
        return { 
          success: false, 
          error: `Listing already exists for ${data.platform} on this product` 
        };
      }

      const listing = await this.prisma.listing.create({
        data: {
          productId: data.productId,
          platform: data.platform,
          platformProductId: data.platformProductId,
          price: data.price,
          currency: data.currency || 'TRY',
          url: data.url,
          inStock: data.inStock ?? true,
          title: data.title,
          description: data.description,
        } as any,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              brand: true,
            } as any,
          },
        },
      });

      return { success: true, listing };
    } catch (error) {
      console.error('Listing creation error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during listing creation' 
      };
    }
  }

  async getListingById(id: string) {
    try {
      const listing = await this.prisma.listing.findUnique({
        where: { id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              brand: true,
            } as any,
          },
        },
      });

      if (!listing) {
        return { success: false, error: 'Listing not found' };
      }

      return { success: true, listing };
    } catch (error) {
      console.error('Listing fetch error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during listing fetch' 
      };
    }
  }

  async updateListing(id: string, data: {
    platform?: string;
    platformProductId?: string;
    price?: number;
    currency?: string;
    url?: string;
    inStock?: boolean;
    title?: string;
    description?: string;
  }) {
    try {
      const updateData: any = {};
      if (data.platform !== undefined) updateData.platform = data.platform;
      if (data.platformProductId !== undefined) updateData.platformProductId = data.platformProductId;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.currency !== undefined) updateData.currency = data.currency;
      if (data.url !== undefined) updateData.url = data.url;
      if (data.inStock !== undefined) updateData.inStock = data.inStock;
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;

      const listing = await this.prisma.listing.update({
        where: { id },
        data: updateData as any,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              brand: true,
            } as any,
          },
        },
      });

      return { success: true, listing };
    } catch (error) {
      console.error('Listing update error:', error);
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return { success: false, error: 'Listing not found' };
      }
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during listing update' 
      };
    }
  }

  async deleteListing(id: string) {
    try {
      await this.prisma.listing.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      console.error('Listing deletion error:', error);
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return { success: false, error: 'Listing not found' };
      }
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during listing deletion' 
      };
    }
  }

  async searchListings(params: {
    productId?: string;
    platform?: string;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {};

      // Filter by product
      if (params.productId) {
        where.productId = params.productId;
      }

      // Filter by platform
      if (params.platform) {
        where.platform = { contains: params.platform, mode: 'insensitive' };
      }

      // Filter by stock status
      if (params.inStock !== undefined) {
        where.inStock = params.inStock;
      }

      // Filter by currency
      if (params.currency) {
        where.currency = params.currency;
      }

      // Price range filter
      if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        where.price = {};
        if (params.minPrice !== undefined) {
          where.price.gte = params.minPrice;
        }
        if (params.maxPrice !== undefined) {
          where.price.lte = params.maxPrice;
        }
      }

      const [listings, total] = await Promise.all([
        this.prisma.listing.findMany({
          where,
          skip,
          take: limit,
          orderBy: { lastUpdated: 'desc' },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
                brand: true,
              } as any,
            },
          },
        }),
        this.prisma.listing.count({ where }),
      ]);

      return {
        success: true,
        listings,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Listing search error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during listing search' 
      };
    }
  }

  async getListingsByProductId(productId: string) {
    return this.searchListings({ productId });
  }

  async getPriceComparison(productId: string) {
    try {
      // Get product info
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true },
      });

      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      // Get all listings for this product
      const listings = await this.prisma.listing.findMany({
        where: { productId },
        orderBy: { price: 'asc' },
      });

      if (listings.length === 0) {
        return {
          success: true,
          productId,
          productName: product.name,
          platformCount: 0,
          listings: [],
        };
      }

      // Calculate price statistics
      const inStockListings = listings.filter(l => l.inStock);
      const prices = inStockListings.map(l => l.price);
      
      const lowestPriceListing = inStockListings.reduce((min, curr) => 
        curr.price < min.price ? curr : min
      );
      
      const highestPriceListing = inStockListings.reduce((max, curr) => 
        curr.price > max.price ? curr : max
      );

      const averagePrice = prices.length > 0 
        ? prices.reduce((sum, price) => sum + price, 0) / prices.length 
        : 0;

      return {
        success: true,
        productId,
        productName: product.name,
        lowestPrice: {
          platform: lowestPriceListing.platform,
          price: lowestPriceListing.price,
          currency: (lowestPriceListing as any).currency || 'TRY',
          url: lowestPriceListing.url,
          inStock: lowestPriceListing.inStock,
        },
        highestPrice: {
          platform: highestPriceListing.platform,
          price: highestPriceListing.price,
          currency: (highestPriceListing as any).currency || 'TRY',
          url: highestPriceListing.url,
          inStock: highestPriceListing.inStock,
        },
        averagePrice: Math.round(averagePrice * 100) / 100,
        platformCount: listings.length,
        listings: listings.map(l => ({
          platform: l.platform,
          price: l.price,
          currency: (l as any).currency || 'TRY',
          url: l.url,
          inStock: l.inStock,
          updatedAt: (l as any).updatedAt || new Date(),
        })),
      };
    } catch (error) {
      console.error('Price comparison error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during price comparison' 
      };
    }
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}
