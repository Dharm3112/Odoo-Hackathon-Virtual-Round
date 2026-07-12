-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_drivers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_category" TEXT NOT NULL,
    "license_expiry" DATETIME NOT NULL,
    "contact_number" TEXT NOT NULL,
    "safety_score" REAL NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "safety_events" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_drivers" ("contact_number", "created_at", "id", "license_category", "license_expiry", "license_number", "name", "safety_events", "safety_score", "status", "updated_at") SELECT "contact_number", "created_at", "id", "license_category", "license_expiry", "license_number", "name", "safety_events", "safety_score", "status", "updated_at" FROM "drivers";
DROP TABLE "drivers";
ALTER TABLE "new_drivers" RENAME TO "drivers";
CREATE UNIQUE INDEX "drivers_license_number_key" ON "drivers"("license_number");
CREATE INDEX "drivers_status_license_expiry_idx" ON "drivers"("status", "license_expiry");
CREATE TABLE "new_roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "permissions" TEXT NOT NULL
);
INSERT INTO "new_roles" ("id", "name", "permissions") SELECT "id", "name", "permissions" FROM "roles";
DROP TABLE "roles";
ALTER TABLE "new_roles" RENAME TO "roles";
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
