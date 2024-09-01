/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `WarehouseStock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WarehouseStock_productId_key" ON "WarehouseStock"("productId");
