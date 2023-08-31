/*
  Warnings:

  - You are about to drop the column `created` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `releasedDate` on the `App` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `App` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `released` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" INTEGER NOT NULL,
    "appId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "released" DATETIME NOT NULL,
    "updated" DATETIME NOT NULL,
    "collection" TEXT NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_App" ("appId", "collection", "id", "title", "updated", "updatedDate") SELECT "appId", "collection", "id", "title", "updated", "updatedDate" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
CREATE UNIQUE INDEX "App_appId_key" ON "App"("appId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
