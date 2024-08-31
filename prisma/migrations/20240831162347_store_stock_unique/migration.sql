/*
  Warnings:

  - A unique constraint covering the columns `[productId,storeId]` on the table `StoreStock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StoreStock_productId_storeId_key" ON "StoreStock"("productId", "storeId");
