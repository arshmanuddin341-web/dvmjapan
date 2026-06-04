-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_auction_listings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lot" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "auction" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "engine" TEXT NOT NULL,
    "startPrice" REAL NOT NULL,
    "soldPrice" REAL NOT NULL,
    "image" TEXT NOT NULL,
    "chassis" TEXT,
    "grade" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "startTime" DATETIME,
    "endTime" DATETIME
);
INSERT INTO "new_auction_listings" ("auction", "chassis", "createdAt", "date", "engine", "grade", "id", "image", "lot", "make", "mileage", "model", "soldPrice", "startPrice", "year") SELECT "auction", "chassis", "createdAt", "date", "engine", "grade", "id", "image", "lot", "make", "mileage", "model", "soldPrice", "startPrice", "year" FROM "auction_listings";
DROP TABLE "auction_listings";
ALTER TABLE "new_auction_listings" RENAME TO "auction_listings";
CREATE UNIQUE INDEX "auction_listings_lot_key" ON "auction_listings"("lot");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
