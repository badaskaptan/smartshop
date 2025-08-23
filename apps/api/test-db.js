const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  console.log('Testing database connection...');
  
  try {
    const prisma = new PrismaClient();
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test User table
    const userCount = await prisma.user.count();
    console.log(`✅ User table accessible - ${userCount} users found`);
    
    // Test Product table
    const productCount = await prisma.product.count();
    console.log(`✅ Product table accessible - ${productCount} products found`);
    
    // Test Listing table
    try {
      const listingCount = await prisma.listing.count();
      console.log(`✅ Listing table accessible - ${listingCount} listings found`);
    } catch (error) {
      console.log('❌ Listing table error:', error.message);
    }
    
    await prisma.$disconnect();
    console.log('✅ Database test completed');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testDatabase();
