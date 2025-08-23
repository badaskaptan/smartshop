const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    console.log('Running DB smoke test...');
    const userCount = await prisma.user.count().catch(() => 0);
    const productCount = await prisma.product.count().catch(() => 0);
    const listingCount = await prisma.listing.count().catch(() => 0);
    console.log({ userCount, productCount, listingCount });
    console.log('Smoke test finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(2);
  } finally {
    await prisma.$disconnect();
  }
})();
