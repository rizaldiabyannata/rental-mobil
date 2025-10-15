-- Add optional slug column and unique index for SEO-friendly URLs
ALTER TABLE "Car" ADD COLUMN "slug" TEXT;

-- PostgreSQL allows multiple NULLs in unique index; existing rows without slug are fine
CREATE UNIQUE INDEX "Car_slug_key" ON "Car" ("slug");