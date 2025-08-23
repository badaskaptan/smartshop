const { Client } = require('pg');
require('dotenv').config();

async function checkProductSchema() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL not found');
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔌 Connected to database');
    
    // Check Product table structure
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'Product' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 Current Product table structure:');
    result.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check if category and imageUrl exist
    const categoryExists = result.rows.some(row => row.column_name === 'category');
    const imageUrlExists = result.rows.some(row => row.column_name === 'imageUrl');
    
    console.log('\n🔍 Field existence check:');
    console.log('  category:', categoryExists ? '✅ EXISTS' : '❌ MISSING');
    console.log('  imageUrl:', imageUrlExists ? '✅ EXISTS' : '❌ MISSING');
    
    if (!categoryExists || !imageUrlExists) {
      console.log('\n🛠️ Adding missing fields...');
      
      if (!categoryExists) {
        await client.query('ALTER TABLE "Product" ADD COLUMN "category" TEXT;');
        console.log('✅ Added category field');
      }
      
      if (!imageUrlExists) {
        await client.query('ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;');
        console.log('✅ Added imageUrl field');
      }
      
      console.log('🔄 Checking updated structure...');
      const updatedResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'Product' 
        ORDER BY ordinal_position;
      `);
      
      console.log('📊 Updated Product table structure:');
      updatedResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

checkProductSchema().catch(console.error);
