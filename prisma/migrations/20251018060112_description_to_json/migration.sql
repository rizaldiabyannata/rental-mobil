/*
Warnings:

- Changed the type of `description` on the `TourPackage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TourPackage" ALTER COLUMN "description" DROP NOT NULL;

ALTER TABLE "TourPackage"
ALTER COLUMN "description" TYPE JSONB USING to_jsonb("description");

ALTER TABLE "TourPackage" ALTER COLUMN "description" SET NOT NULL;