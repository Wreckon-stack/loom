/*
  Warnings:

  - Added the required column `creatorId` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Community" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "banner" TEXT,
    "color" TEXT NOT NULL DEFAULT '#8B5CF6',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Community_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Community" ("banner", "color", "createdAt", "description", "icon", "id", "name", "slug", "updatedAt") SELECT "banner", "color", "createdAt", "description", "icon", "id", "name", "slug", "updatedAt" FROM "Community";
DROP TABLE "Community";
ALTER TABLE "new_Community" RENAME TO "Community";
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");
CREATE UNIQUE INDEX "Community_slug_key" ON "Community"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
