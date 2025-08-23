const { Client } = require('pg');
require('dotenv').config();

async function addProductFields() {
  // Temporarily disable SSL verification for development
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  // Parse the DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    
    console.log('📝 Adding new Product fields...');
    
    // Add the new columns
    const sql = `
      -- Add missing columns to Product table
      ALTER TABLE "Product" 
      ADD COLUMN IF NOT EXISTS "category" TEXT,
      ADD COLUMN IF NOT EXISTS "imageUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `;
    
    await client.query(sql);
    
    console.log('✅ Product fields added successfully!');
    
    // Verify the changes
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Product' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 Product table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

addProductFields().catch(console.error);
