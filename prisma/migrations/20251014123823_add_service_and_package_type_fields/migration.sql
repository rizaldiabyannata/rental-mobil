-- AlterTable
ALTER TABLE "TariffItem" ADD COLUMN     "packageType" TEXT,
ADD COLUMN     "serviceType" TEXT;

-- CreateIndex
CREATE INDEX "TariffItem_serviceType_idx" ON "TariffItem"("serviceType");

-- CreateIndex
CREATE INDEX "TariffItem_packageType_idx" ON "TariffItem"("packageType");
