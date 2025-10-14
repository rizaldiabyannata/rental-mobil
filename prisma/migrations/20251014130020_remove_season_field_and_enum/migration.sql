/*
  Warnings:

  - You are about to drop the column `season` on the `TariffItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TariffItem" DROP COLUMN "season";

-- DropEnum
DROP TYPE "Season";
