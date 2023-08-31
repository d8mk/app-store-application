-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "App_appId_key" ON "App"("appId");
