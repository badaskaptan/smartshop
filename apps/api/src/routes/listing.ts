import { FastifyInstance } from 'fastify';
import { ListingService } from '../services/listing';
import { 
  CreateListingRequest, 
  UpdateListingRequest, 
  ListingSearchQuery 
} from '../types/listing';

export async function listingRoutes(fastify: FastifyInstance) {
  const listingService = new ListingService();

  // Listing oluştur
  fastify.post<{ Body: CreateListingRequest }>('/listings', async (request, reply) => {
    try {
      const listing = await listingService.createListing(request.body);
      reply.code(201).send({
        success: true,
        data: listing,
      });
    } catch (error) {
      reply.code(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Listing detayı getir
  fastify.get<{ Params: { id: string } }>('/listings/:id', async (request, reply) => {
    try {
      const listing = await listingService.getListingById(request.params.id);
      reply.send({
        success: true,
        data: listing,
      });
    } catch (error) {
      reply.code(404).send({
        success: false,
        error: error instanceof Error ? error.message : 'Listing not found',
      });
    }
  });

  // Listing güncelle
  fastify.put<{ 
    Params: { id: string }, 
    Body: UpdateListingRequest 
  }>('/listings/:id', async (request, reply) => {
    try {
      const listing = await listingService.updateListing(request.params.id, request.body);
      reply.send({
        success: true,
        data: listing,
      });
    } catch (error) {
      reply.code(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Update failed',
      });
    }
  });

  // Listing sil
  fastify.delete<{ Params: { id: string } }>('/listings/:id', async (request, reply) => {
    try {
      await listingService.deleteListing(request.params.id);
      reply.send({
        success: true,
        message: 'Listing deleted successfully',
      });
    } catch (error) {
      reply.code(404).send({
        success: false,
        error: error instanceof Error ? error.message : 'Listing not found',
      });
    }
  });

  // Listing ara
  fastify.get<{ Querystring: ListingSearchQuery }>('/listings', async (request, reply) => {
    try {
      const { page = 1, limit = 10, ...filters } = request.query;
      const result = await listingService.searchListings({
        ...filters,
        page: Number(page),
        limit: Number(limit),
      });
      reply.send({
        success: true,
        data: result,
      });
    } catch (error) {
      reply.code(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
      });
    }
  });

  // Ürüne ait listingleri getir
  fastify.get<{ Params: { productId: string } }>('/products/:productId/listings', async (request, reply) => {
    try {
      const listings = await listingService.getListingsByProductId(request.params.productId);
      reply.send({
        success: true,
        data: listings,
      });
    } catch (error) {
      reply.code(404).send({
        success: false,
        error: error instanceof Error ? error.message : 'Product not found',
      });
    }
  });

  // Ürün fiyat karşılaştırması
  fastify.get<{ Params: { productId: string } }>('/products/:productId/price-comparison', async (request, reply) => {
    try {
      const comparison = await listingService.getPriceComparison(request.params.productId);
      reply.send({
        success: true,
        data: comparison,
      });
    } catch (error) {
      reply.code(404).send({
        success: false,
        error: error instanceof Error ? error.message : 'Product not found',
      });
    }
  });
}
