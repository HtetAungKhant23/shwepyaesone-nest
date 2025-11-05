/*
  Warnings:

  - You are about to drop the column `rice_id` on the `supplier_payment_items` table. All the data in the column will be lost.
  - You are about to drop the column `otherCharges` on the `supplier_payments` table. All the data in the column will be lost.
  - Added the required column `batch_item_id` to the `supplier_payment_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "supplier_payment_items" DROP CONSTRAINT "supplier_payment_items_rice_id_fkey";

-- AlterTable
ALTER TABLE "supplier_payment_items" DROP COLUMN "rice_id";
ALTER TABLE "supplier_payment_items" ADD COLUMN     "batch_item_id" STRING NOT NULL;

-- AlterTable
ALTER TABLE "supplier_payments" DROP COLUMN "otherCharges";
ALTER TABLE "supplier_payments" ADD COLUMN     "serviceCharges" JSONB;

-- AddForeignKey
ALTER TABLE "supplier_payment_items" ADD CONSTRAINT "supplier_payment_items_batch_item_id_fkey" FOREIGN KEY ("batch_item_id") REFERENCES "batch_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
