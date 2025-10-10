/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `rice_by_suppliers` table. All the data in the column will be lost.
  - You are about to drop the `inventories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `warehouseId` to the `rice_by_suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rice_by_suppliers" DROP CONSTRAINT "rice_by_suppliers_inventoryId_fkey";

-- AlterTable
ALTER TABLE "rice_by_suppliers" DROP COLUMN "inventoryId";
ALTER TABLE "rice_by_suppliers" ADD COLUMN     "warehouseId" STRING NOT NULL;

-- DropTable
DROP TABLE "inventories";

-- CreateTable
CREATE TABLE "warehouses" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "address" STRING NOT NULL,
    "totalStock" INT4 NOT NULL DEFAULT 0,
    "deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rice_by_suppliers" ADD CONSTRAINT "rice_by_suppliers_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
