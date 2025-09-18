/*
  Warnings:

  - Added the required column `name` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "deleted" BOOL NOT NULL DEFAULT false;
ALTER TABLE "inventories" ADD COLUMN     "name" STRING NOT NULL;

-- AlterTable
ALTER TABLE "rice_by_suppliers" ADD COLUMN     "deleted" BOOL NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "rice_categories" ADD COLUMN     "deleted" BOOL NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "rices" ADD COLUMN     "deleted" BOOL NOT NULL DEFAULT false;
