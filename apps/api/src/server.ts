import Fastify from 'fastify';
import { authRoutes } from './routes/auth';

// For self-test
async function fetchWrapper(url: string) {
  const fetch = (await import('node-fetch')).default;
  return fetch(url);
}

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Simple health route
fastify.get('/health', async () => ({ status: 'ok', ts: Date.now() }));

// Mock search endpoint for MVP
fastify.get('/api/search', async (request, reply) => {
  const q = (request.query as any)?.q || '';

  // Return mocked consolidated results
  const results = [
    {
      id: 'ps5-digital',
      name: 'Sony PlayStation 5 Digital Edition',
      platforms: [
        { platform: 'Trendyol', price: 8999 },
        { platform: 'Amazon', price: 9299 },
        { platform: 'Hepsiburada', price: 9150 }
      ],
      bestPrice: { platform: 'Trendyol', price: 8999 }
    },
    {
      id: 'iphone-15-128',
      name: 'Apple iPhone 15 128GB',
      platforms: [
        { platform: 'Amazon', price: 42999 },
        { platform: 'Trendyol', price: 43499 },
        { platform: 'Hepsiburada', price: 43200 }
      ],
      bestPrice: { platform: 'Amazon', price: 42999 }
    }
  ];

  // Basic filter by query
  const filtered = q ? results.filter(r => r.name.toLowerCase().includes(String(q).toLowerCase())) : results;
  return { query: q, count: filtered.length, results: filtered };
});

const start = async () => {
  try {
    console.log('Starting server...');
    
    // Register auth routes
    console.log('Registering auth routes...');
    fastify.register(authRoutes);
    
    console.log('Starting to listen...');
    try {
      await fastify.listen({ port: PORT, host: '127.0.0.1' });
      console.log(`✅ Server successfully listening on http://127.0.0.1:${PORT}`);
      
      // Test that we can actually make a request to ourselves
      setTimeout(async () => {
        try {
          const response = await fetchWrapper(`http://127.0.0.1:${PORT}/health`);
          console.log('✅ Self-test successful:', await response.text());
        } catch (e) {
          console.error('❌ Self-test failed:', (e as Error).message);
        }
      }, 1000);
      
    } catch (listenError) {
      console.error('❌ Listen failed:', listenError);
      throw listenError;
    }
    fastify.log.info(`API listening on ${PORT}`);
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
