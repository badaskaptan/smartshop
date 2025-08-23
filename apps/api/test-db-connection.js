const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✓ Database connection successful');
    
    // Try to run a simple query to check if tables exist
    try {
      const userCount = await prisma.user.count();
      console.log(`✓ Tables exist - User count: ${userCount}`);
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('Tables do not exist yet - will try to create them');
        
        // Try to push the schema
        console.log('Attempting to push schema...');
        const { spawn } = require('child_process');
        
        return new Promise((resolve, reject) => {
          const child = spawn('npx', ['prisma', 'db', 'push', '--schema=prisma/schema.prisma'], {
            stdio: 'inherit',
            cwd: process.cwd()
          });
          
          child.on('close', (code) => {
            if (code === 0) {
              console.log('✓ Schema pushed successfully');
              resolve();
            } else {
              console.log('✗ Schema push failed');
              reject(new Error(`Schema push failed with code ${code}`));
            }
          });
        });
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .then(() => {
    console.log('Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  });
