/*
  Warnings:

  - Made the column `serviceCharges` on table `supplier_payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "supplier_payments" ADD COLUMN     "otherExpenses" JSONB;
ALTER TABLE "supplier_payments" ALTER COLUMN "serviceCharges" SET NOT NULL;
