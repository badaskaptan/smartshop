import { PrismaClient } from '@prisma/client';

export class ProductService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['error'],
    });
  }

  async createProduct(data: {
    name: string;
    description?: string;
    category?: string;
    brand?: string;
    model?: string;
    imageUrl?: string;
  }) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          brand: data.brand,
          model: data.model,
          ...(data.category && { category: data.category }),
          ...(data.imageUrl && { imageUrl: data.imageUrl }),
        } as any,
      });

      return { success: true, product };
    } catch (error) {
      console.error('Product creation error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during product creation' 
      };
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      return { success: true, product };
    } catch (error) {
      console.error('Product fetch error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during product fetch' 
      };
    }
  }

  async updateProduct(id: string, data: {
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    model?: string;
    imageUrl?: string;
  }) {
    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.brand !== undefined) updateData.brand = data.brand;
      if (data.model !== undefined) updateData.model = data.model;
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

      const product = await this.prisma.product.update({
        where: { id },
        data: updateData as any,
      });

      return { success: true, product };
    } catch (error) {
      console.error('Product update error:', error);
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return { success: false, error: 'Product not found' };
      }
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during product update' 
      };
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      console.error('Product deletion error:', error);
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return { success: false, error: 'Product not found' };
      }
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during product deletion' 
      };
    }
  }

  async searchProducts(params: {
    q?: string;
    category?: string;
    brand?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {};

      // Text search in name and description
      if (params.q) {
        where.OR = [
          { name: { contains: params.q, mode: 'insensitive' } },
          { description: { contains: params.q, mode: 'insensitive' } },
          { brand: { contains: params.q, mode: 'insensitive' } },
          { model: { contains: params.q, mode: 'insensitive' } },
        ];
      }

      // Filter by category
      if (params.category) {
        where.category = { contains: params.category, mode: 'insensitive' };
      }

      // Filter by brand
      if (params.brand) {
        where.brand = { contains: params.brand, mode: 'insensitive' };
      }

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({ where }),
      ]);

      return {
        success: true,
        products,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Product search error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during product search' 
      };
    }
  }

  async getAllProducts(page: number = 1, limit: number = 20) {
    return this.searchProducts({ page, limit });
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}
