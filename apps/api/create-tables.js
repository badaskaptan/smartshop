const { Client } = require('pg');

async function createTables() {
  // Parse the DATABASE_URL from .env
  const fs = require('fs');
  const envContent = fs.readFileSync('.env', 'utf8');
  const databaseUrlMatch = envContent.match(/DATABASE_URL="(.+)"/);
  
  if (!databaseUrlMatch) {
    throw new Error('DATABASE_URL not found in .env file');
  }
  
  const databaseUrl = databaseUrlMatch[1];
  console.log('Connecting to database...');
  
  const client = new Client({
    connectionString: databaseUrl
  });
  
  try {
    await client.connect();
    console.log('✓ Connected to database');
    
    // Read the SQL migration file
    const sqlContent = fs.readFileSync('supabase/migrations/20250823192438_init.sql', 'utf8');
    
    console.log('Executing migration SQL...');
    await client.query(sqlContent);
    console.log('✓ Migration executed successfully');
    
    // Test that tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Product', 'Listing', 'PriceHistory')
    `);
    
    console.log('✓ Tables created:', result.rows.map(row => row.table_name));
    
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

createTables()
  .then(() => {
    console.log('Database migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exit(1);
  });
