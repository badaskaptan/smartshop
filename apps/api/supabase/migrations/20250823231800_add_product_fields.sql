-- Add missing columns to Product table
ALTER TABLE "Product" 
ADD COLUMN "category" TEXT,
ADD COLUMN "imageUrl" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
