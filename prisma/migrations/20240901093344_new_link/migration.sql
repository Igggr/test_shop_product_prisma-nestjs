/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `WarehouseStock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `WarehouseStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WarehouseStock" ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseStock_productId_key" ON "WarehouseStock"("productId");

-- AddForeignKey
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
