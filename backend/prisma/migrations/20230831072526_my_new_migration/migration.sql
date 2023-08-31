/*
  Warnings:

  - Added the required column `releasedDate` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedDate` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releasedDate" DATETIME NOT NULL,
    "updatedDate" DATETIME NOT NULL,
    "collection" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_App" ("appId", "collection", "created", "id", "updated") SELECT "appId", "collection", "created", "id", "updated" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
CREATE UNIQUE INDEX "App_appId_key" ON "App"("appId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
