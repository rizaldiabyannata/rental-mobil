-- AlterTable
ALTER TABLE "TariffItem" ADD COLUMN     "carId" TEXT;

-- CreateIndex
CREATE INDEX "TariffItem_carId_idx" ON "TariffItem"("carId");

-- AddForeignKey
ALTER TABLE "TariffItem" ADD CONSTRAINT "TariffItem_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
