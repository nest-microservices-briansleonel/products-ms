/*
  Warnings:

  - You are about to drop the column `available` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);
INSERT INTO "new_Product" ("created_at", "description", "id", "name", "price", "updated_at") SELECT "created_at", "description", "id", "name", "price", "updated_at" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_deleted_at_idx" ON "Product"("deleted_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
