/*
  Warnings:

  - You are about to drop the column `productId` on the `WarehouseStock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WarehouseStock" DROP CONSTRAINT "WarehouseStock_productId_fkey";

-- DropIndex
DROP INDEX "WarehouseStock_productId_key";

-- AlterTable
ALTER TABLE "WarehouseStock" DROP COLUMN "productId";
