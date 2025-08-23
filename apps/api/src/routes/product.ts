import { FastifyInstance } from 'fastify';
import { ProductService } from '../services/product';
import { 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductResponse, 
  ProductListResponse,
  ProductSearchQuery 
} from '../types/product';

export async function productRoutes(fastify: FastifyInstance) {
  const productService = new ProductService();

  // Create product
  fastify.post<{ Body: CreateProductRequest }>('/api/products', async (request, reply) => {
    try {
      const { name, description, category, brand, model, imageUrl } = request.body;

      // Basic validation
      if (!name || name.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Product name is required'
        } as ProductResponse);
      }

      const result = await productService.createProduct({
        name: name.trim(),
        description: description?.trim(),
        category: category?.trim(),
        brand: brand?.trim(),
        model: model?.trim(),
        imageUrl: imageUrl?.trim(),
      });

      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: result.error
        } as ProductResponse);
      }

      return reply.status(201).send({
        success: true,
        product: result.product
      } as ProductResponse);

    } catch (error) {
      console.error('Product creation error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error during product creation'
      } as ProductResponse);
    }
  });

  // Get product by ID
  fastify.get<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      if (!id || id.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Product ID is required'
        } as ProductResponse);
      }

      const result = await productService.getProductById(id);

      if (!result.success) {
        const statusCode = result.error === 'Product not found' ? 404 : 400;
        return reply.status(statusCode).send({
          success: false,
          error: result.error
        } as ProductResponse);
      }

      return reply.send({
        success: true,
        product: result.product
      } as ProductResponse);

    } catch (error) {
      console.error('Product fetch error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error during product fetch'
      } as ProductResponse);
    }
  });

  // Update product
  fastify.put<{ Params: { id: string }, Body: UpdateProductRequest }>('/api/products/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, description, category, brand, model, imageUrl } = request.body;

      if (!id || id.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Product ID is required'
        } as ProductResponse);
      }

      // Check if at least one field is provided for update
      if (!name && !description && !category && !brand && !model && !imageUrl) {
        return reply.status(400).send({
          success: false,
          error: 'At least one field must be provided for update'
        } as ProductResponse);
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (category !== undefined) updateData.category = category?.trim();
      if (brand !== undefined) updateData.brand = brand?.trim();
      if (model !== undefined) updateData.model = model?.trim();
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim();

      // Validate name if provided
      if (updateData.name && updateData.name.length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Product name cannot be empty'
        } as ProductResponse);
      }

      const result = await productService.updateProduct(id, updateData);

      if (!result.success) {
        const statusCode = result.error === 'Product not found' ? 404 : 400;
        return reply.status(statusCode).send({
          success: false,
          error: result.error
        } as ProductResponse);
      }

      return reply.send({
        success: true,
        product: result.product
      } as ProductResponse);

    } catch (error) {
      console.error('Product update error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error during product update'
      } as ProductResponse);
    }
  });

  // Delete product
  fastify.delete<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      if (!id || id.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Product ID is required'
        } as ProductResponse);
      }

      const result = await productService.deleteProduct(id);

      if (!result.success) {
        const statusCode = result.error === 'Product not found' ? 404 : 400;
        return reply.status(statusCode).send({
          success: false,
          error: result.error
        } as ProductResponse);
      }

      return reply.status(204).send();

    } catch (error) {
      console.error('Product deletion error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error during product deletion'
      } as ProductResponse);
    }
  });

  // Search/List products
  fastify.get<{ Querystring: ProductSearchQuery }>('/api/products', async (request, reply) => {
    try {
      const { q, category, brand, page = 1, limit = 20 } = request.query;

      // Validate pagination params
      const pageNum = Math.max(1, parseInt(String(page)) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 20));

      const result = await productService.searchProducts({
        q: q?.trim(),
        category: category?.trim(),
        brand: brand?.trim(),
        page: pageNum,
        limit: limitNum,
      });

      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: result.error
        } as ProductListResponse);
      }

      return reply.send({
        success: true,
        products: result.products,
        total: result.total,
        page: result.page,
        limit: result.limit
      } as ProductListResponse);

    } catch (error) {
      console.error('Product search error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error during product search'
      } as ProductListResponse);
    }
  });
}
