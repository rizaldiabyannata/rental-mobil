/*
  Warnings:

  - You are about to drop the `CarTariff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarTariff" DROP CONSTRAINT "CarTariff_carId_fkey";

-- DropTable
DROP TABLE "CarTariff";
