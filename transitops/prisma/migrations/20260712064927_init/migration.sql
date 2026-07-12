-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "permissions" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registration_number" TEXT NOT NULL,
    "name_model" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "max_load_capacity" REAL NOT NULL,
    "odometer" REAL NOT NULL DEFAULT 0,
    "acquisition_cost" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "region" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_category" TEXT NOT NULL,
    "license_expiry" DATETIME NOT NULL,
    "contact_number" TEXT NOT NULL,
    "safety_score" REAL NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "safety_events" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "trips" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trip_code" TEXT NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "cargo_weight" REAL NOT NULL,
    "planned_distance" REAL NOT NULL,
    "actual_distance" REAL,
    "fuel_consumed" REAL,
    "start_odometer" REAL,
    "end_odometer" REAL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "revenue" REAL,
    "dispatched_at" DATETIME,
    "completed_at" DATETIME,
    "cancelled_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trips_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trips_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "maintenance_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "record_code" TEXT NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "service_type" TEXT NOT NULL,
    "description" TEXT,
    "cost" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" DATETIME,
    CONSTRAINT "maintenance_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fuel_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "log_code" TEXT NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "log_date" DATETIME NOT NULL,
    "liters" REAL NOT NULL,
    "cost_per_liter" REAL NOT NULL,
    "total_cost" REAL NOT NULL,
    "odometer_at_fill" REAL,
    "receipt_url" TEXT,
    "approval_status" TEXT NOT NULL DEFAULT 'Pending',
    "approved_by" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fuel_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expense_code" TEXT NOT NULL,
    "trip_id" INTEGER,
    "vehicle_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "expense_date" DATETIME NOT NULL,
    "description" TEXT,
    "receipt_url" TEXT,
    "approval_status" TEXT NOT NULL DEFAULT 'Pending',
    "approved_by" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "expenses_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_registration_number_key" ON "vehicles"("registration_number");

-- CreateIndex
CREATE INDEX "vehicles_status_idx" ON "vehicles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_license_number_key" ON "drivers"("license_number");

-- CreateIndex
CREATE INDEX "drivers_status_license_expiry_idx" ON "drivers"("status", "license_expiry");

-- CreateIndex
CREATE UNIQUE INDEX "trips_trip_code_key" ON "trips"("trip_code");

-- CreateIndex
CREATE INDEX "trips_status_idx" ON "trips"("status");

-- CreateIndex
CREATE INDEX "trips_vehicle_id_driver_id_idx" ON "trips"("vehicle_id", "driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_logs_record_code_key" ON "maintenance_logs"("record_code");

-- CreateIndex
CREATE INDEX "maintenance_logs_vehicle_id_status_idx" ON "maintenance_logs"("vehicle_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "fuel_logs_log_code_key" ON "fuel_logs"("log_code");

-- CreateIndex
CREATE INDEX "fuel_logs_vehicle_id_log_date_idx" ON "fuel_logs"("vehicle_id", "log_date");

-- CreateIndex
CREATE UNIQUE INDEX "expenses_expense_code_key" ON "expenses"("expense_code");
