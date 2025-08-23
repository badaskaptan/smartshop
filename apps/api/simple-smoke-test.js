const { Client } = require('pg');

async function smokeTest() {
  const fs = require('fs');
  const envContent = fs.readFileSync('.env', 'utf8');
  const databaseUrlMatch = envContent.match(/DATABASE_URL="(.+)"/);
  
  if (!databaseUrlMatch) {
    throw new Error('DATABASE_URL not found in .env file');
  }
  
  const databaseUrl = databaseUrlMatch[1];
  console.log('Running DB smoke test...');
  
  const client = new Client({
    connectionString: databaseUrl
  });
  
  try {
    await client.connect();
    console.log('✓ Connected to database');
    
    // Count records in each table
    const userResult = await client.query('SELECT COUNT(*) FROM "User"');
    const productResult = await client.query('SELECT COUNT(*) FROM "Product"');
    const listingResult = await client.query('SELECT COUNT(*) FROM "Listing"');
    const priceHistoryResult = await client.query('SELECT COUNT(*) FROM "PriceHistory"');
    
    const counts = {
      userCount: parseInt(userResult.rows[0].count),
      productCount: parseInt(productResult.rows[0].count),
      listingCount: parseInt(listingResult.rows[0].count),
      priceHistoryCount: parseInt(priceHistoryResult.rows[0].count)
    };
    
    console.log('Table counts:', counts);
    console.log('✓ Smoke test completed successfully!');
    
    return counts;
  } catch (error) {
    console.error('✗ Smoke test failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

smokeTest()
  .then(() => {
    console.log('Database is ready for use!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Smoke test failed:', error.message);
    process.exit(1);
  });
