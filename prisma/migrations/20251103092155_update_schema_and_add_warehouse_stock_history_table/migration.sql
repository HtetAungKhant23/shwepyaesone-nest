/*
  Warnings:

  - You are about to drop the column `categoryId` on the `rices` table. All the data in the column will be lost.
  - The `phone` column on the `suppliers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `totalStock` on the `warehouses` table. All the data in the column will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rice_by_suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rice_categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creator_id` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `warehouses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rice_by_suppliers" DROP CONSTRAINT "rice_by_suppliers_riceId_fkey";

-- DropForeignKey
ALTER TABLE "rice_by_suppliers" DROP CONSTRAINT "rice_by_suppliers_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "rice_by_suppliers" DROP CONSTRAINT "rice_by_suppliers_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "rices" DROP CONSTRAINT "rices_categoryId_fkey";

-- DropIndex
DROP INDEX "suppliers_phone_key";

-- AlterTable
ALTER TABLE "rices" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "creator_id" STRING NOT NULL;
ALTER TABLE "suppliers" DROP COLUMN "phone";
ALTER TABLE "suppliers" ADD COLUMN     "phone" STRING[];

-- AlterTable
ALTER TABLE "warehouses" DROP COLUMN "totalStock";
ALTER TABLE "warehouses" ADD COLUMN     "creator_id" STRING NOT NULL;
ALTER TABLE "warehouses" ADD COLUMN     "total_stock" INT4 NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "rice_by_suppliers";

-- DropTable
DROP TABLE "rice_categories";

-- CreateTable
CREATE TABLE "batches" (
    "id" STRING NOT NULL,
    "batch_no" STRING NOT NULL,
    "total_stock" INT4 NOT NULL DEFAULT 0,
    "paid" BOOL NOT NULL DEFAULT false,
    "store_in_warehouse" BOOL NOT NULL DEFAULT false,
    "deleted" BOOL NOT NULL DEFAULT false,
    "supplier_id" STRING NOT NULL,
    "creator_id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_items" (
    "id" STRING NOT NULL,
    "total_stock" INT4 NOT NULL DEFAULT 0,
    "remain_stock" INT4 NOT NULL DEFAULT 0,
    "paid_qty" INT4 NOT NULL DEFAULT 0,
    "paid" BOOL NOT NULL DEFAULT false,
    "rice_id" STRING NOT NULL,
    "batch_id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_payments" (
    "id" STRING NOT NULL,
    "total_amount" INT4 NOT NULL DEFAULT 0,
    "note" STRING,
    "otherCharges" JSONB,
    "paid" BOOL NOT NULL DEFAULT false,
    "batch_id" STRING NOT NULL,
    "creator_id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_payment_items" (
    "id" STRING NOT NULL,
    "price" INT4 NOT NULL DEFAULT 0,
    "qty" INT4 NOT NULL DEFAULT 0,
    "rice_id" STRING NOT NULL,
    "supplier_payment_id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_payment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_items" (
    "id" STRING NOT NULL,
    "stock" INT4 NOT NULL DEFAULT 0,
    "rice_id" STRING NOT NULL,
    "warehouse_id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stock_histories" (
    "id" STRING NOT NULL,
    "total_stock" INT4 NOT NULL DEFAULT 0,
    "rice_id" STRING NOT NULL,
    "fromBatchId" STRING,
    "fromWarehouseId" STRING,
    "toWarehouseId" STRING,
    "deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creator_id" STRING NOT NULL,

    CONSTRAINT "warehouse_stock_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_items_rice_id_key" ON "warehouse_items"("rice_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_stock_histories_rice_id_key" ON "warehouse_stock_histories"("rice_id");

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_items" ADD CONSTRAINT "batch_items_rice_id_fkey" FOREIGN KEY ("rice_id") REFERENCES "rices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_items" ADD CONSTRAINT "batch_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payment_items" ADD CONSTRAINT "supplier_payment_items_rice_id_fkey" FOREIGN KEY ("rice_id") REFERENCES "rices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payment_items" ADD CONSTRAINT "supplier_payment_items_supplier_payment_id_fkey" FOREIGN KEY ("supplier_payment_id") REFERENCES "supplier_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_items" ADD CONSTRAINT "warehouse_items_rice_id_fkey" FOREIGN KEY ("rice_id") REFERENCES "rices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_items" ADD CONSTRAINT "warehouse_items_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock_histories" ADD CONSTRAINT "warehouse_stock_histories_rice_id_fkey" FOREIGN KEY ("rice_id") REFERENCES "rices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock_histories" ADD CONSTRAINT "warehouse_stock_histories_fromBatchId_fkey" FOREIGN KEY ("fromBatchId") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock_histories" ADD CONSTRAINT "warehouse_stock_histories_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock_histories" ADD CONSTRAINT "warehouse_stock_histories_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock_histories" ADD CONSTRAINT "warehouse_stock_histories_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
