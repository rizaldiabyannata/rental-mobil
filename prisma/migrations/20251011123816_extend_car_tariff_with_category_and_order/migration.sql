-- AlterTable
ALTER TABLE "CarTariff" ADD COLUMN     "category" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
