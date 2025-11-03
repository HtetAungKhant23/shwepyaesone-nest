/*
  Warnings:

  - A unique constraint covering the columns `[rice_id,warehouse_id]` on the table `warehouse_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "warehouse_items_rice_id_key";

-- DropIndex
DROP INDEX "warehouse_stock_histories_rice_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_items_rice_id_warehouse_id_key" ON "warehouse_items"("rice_id", "warehouse_id");
