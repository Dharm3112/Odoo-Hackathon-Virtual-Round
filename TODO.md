# TransitOps — TODO Checklist

**Event**: Odoo Hackathon — Virtual Round (8-Hour Sprint)  
**Derived From**: [PRD.md](./PRD.md) • [TechStack.md](./TechStack.md)  
**Legend**: `[ ]` Todo · `[/]` In Progress · `[x]` Done · `⭐` Bonus Feature · `🔴` Critical/Blocker

---

## Phase 0: Project Setup & Database (0:00 – 0:30) — 30 min

### 0.1 Initialize Next.js Project
- [ ] 🔴 Run `npx -y create-next-app@14 ./ --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm`
- [ ] Verify project starts with `npm run dev` → localhost:3000
- [ ] Remove default Next.js boilerplate (default page content, favicon)

### 0.2 Install Dependencies
- [ ] 🔴 Install production deps:
  ```
  npm install @prisma/client next-auth bcryptjs zod recharts @json2csv/plainjs class-variance-authority clsx tailwind-merge lucide-react sonner date-fns
  ```
- [ ] Install dev deps:
  ```
  npm install -D prisma @types/bcryptjs tailwindcss-animate tsx
  ```
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Initialize shadcn/ui: `npx shadcn-ui@latest init`

### 0.3 Configure Tailwind
- [ ] Add `tailwindcss-animate` to Tailwind plugins
- [ ] Set `darkMode: 'class'` in `tailwind.config.ts`
- [ ] Configure shadcn/ui color scheme in `tailwind.config.ts`

### 0.4 Setup Fonts & Global Styles
- [ ] Import `Inter` (body) and `Outfit` (headings) via `next/font/google` in `app/layout.tsx`
- [ ] Define CSS variables in `app/globals.css`:
  - Brand colors (primary: Indigo, secondary: Violet, accent: Cyan)
  - Status colors (available: green, on-trip: blue, in-shop: orange, retired: grey)
  - Badge colors (draft, dispatched, completed, cancelled, suspended)
  - Glassmorphism tokens (glass-bg, glass-blur, glass-border)
  - Dark mode overrides under `.dark` class

### 0.5 Setup Environment Variables
- [ ] Create `.env` file with:
  - `DATABASE_URL` (PostgreSQL connection string or SQLite `file:./dev.db`)
  - `NEXTAUTH_URL=http://localhost:3000`
  - `NEXTAUTH_SECRET` (random 32+ char string)
  - `NEXT_PUBLIC_APP_NAME=TransitOps`
- [ ] Create `.env.example` (same keys, placeholder values)
- [ ] Add `.env` to `.gitignore`

### 0.6 Database Schema (Prisma)
- [ ] 🔴 Create `prisma/schema.prisma` with all 8 entities:
  - [ ] `Role` model (id, name UK, permissions JSON)
  - [ ] `User` model (id, email UK, password_hash, full_name, role_id FK, created_at, last_login, is_active)
  - [ ] `Vehicle` model (id, registration_number UK, name_model, type, max_load_capacity, odometer, acquisition_cost, status default "Available", region, created_at, updated_at)
  - [ ] `Driver` model (id, name, license_number UK, license_category, license_expiry, contact_number, safety_score default 100, status default "Available", safety_events JSON, created_at, updated_at)
  - [ ] `Trip` model (id, trip_code UK, vehicle_id FK, driver_id FK, created_by FK, source, destination, cargo_weight, planned_distance, actual_distance, fuel_consumed, start_odometer, end_odometer, status default "Draft", revenue, dispatched_at, completed_at, cancelled_at, created_at)
  - [ ] `MaintenanceLog` model (id, record_code UK, vehicle_id FK, service_type, description, cost, status default "Active", created_at, closed_at)
  - [ ] `FuelLog` model (id, log_code UK, vehicle_id FK, log_date, liters, cost_per_liter, total_cost, odometer_at_fill, receipt_url, approval_status default "Pending", approved_by FK, created_at)
  - [ ] `Expense` model (id, expense_code UK, trip_id FK optional, vehicle_id FK, category, amount, expense_date, description, receipt_url, approval_status default "Pending", approved_by FK, created_at)
- [ ] Define all relations:
  - [ ] Role → Users (one-to-many)
  - [ ] User → Trips (one-to-many via created_by)
  - [ ] Vehicle → Trips, MaintenanceLogs, FuelLogs, Expenses (one-to-many each)
  - [ ] Driver → Trips (one-to-many)
- [ ] Define indexes:
  - [ ] `vehicles.status` (B-TREE)
  - [ ] `drivers.[status, license_expiry]` (COMPOSITE)
  - [ ] `trips.status` (B-TREE)
  - [ ] `trips.[vehicle_id, driver_id]` (COMPOSITE)
  - [ ] `fuel_logs.[vehicle_id, log_date]` (COMPOSITE)
  - [ ] `maintenance_logs.[vehicle_id, status]` (COMPOSITE)
- [ ] 🔴 Run `npx prisma migrate dev --name init`
- [ ] Create `lib/prisma.ts` — singleton Prisma client

### 0.7 Seed Demo Data
- [ ] 🔴 Create `prisma/seed.ts` with:
  - [ ] 4 Roles: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst (with permission JSON)
  - [ ] 4 Users (one per role) with bcrypt-hashed passwords
  - [ ] 12 Vehicles (mix of Van, Truck, Mini, Bus, Sedan — mix of Available/On Trip/In Shop/Retired)
  - [ ] 10 Drivers (mix of Available/On Trip/Off Duty/Suspended — 2 with expired licenses)
  - [ ] 6 Trips (2 Draft, 2 Dispatched, 1 Completed, 1 Cancelled)
  - [ ] 4 Maintenance records (2 Active, 2 Closed)
  - [ ] 12 Fuel logs (spread across vehicles)
  - [ ] 6 Expense records (mix of Toll, Parking, Penalty categories)
- [ ] Add seed script to `package.json`: `"prisma": { "seed": "tsx prisma/seed.ts" }`
- [ ] Run `npx prisma db seed` — verify data in Prisma Studio

### 0.8 Utility Files
- [ ] Create `lib/utils.ts` — `cn()` class merge helper (clsx + tailwind-merge)
- [ ] Create `lib/constants.ts` — Enums and constants:
  - Vehicle statuses: `Available`, `On Trip`, `In Shop`, `Retired`
  - Vehicle types: `Van`, `Truck`, `Mini`, `Bus`, `Sedan`
  - Driver statuses: `Available`, `On Trip`, `Off Duty`, `Suspended`
  - Trip statuses: `Draft`, `Dispatched`, `Completed`, `Cancelled`
  - Maintenance statuses: `Active`, `Closed`
  - Service types: `Oil Change`, `Tire Replacement`, `Engine Repair`, `Brake Service`, `General Inspection`, `Other`
  - Expense categories: `Toll`, `Parking`, `Penalty`, `Repair`, `Miscellaneous`
  - License categories: `LMV`, `HMV`, `HGV`
  - Regions: `North`, `South`, `East`, `West`
- [ ] Create `lib/chart-colors.ts` — color palette for Recharts

---

## Phase 1: Authentication & RBAC (0:30 – 1:00) — 30 min

### 1.1 NextAuth.js Configuration
- [ ] 🔴 Create `lib/auth.ts`:
  - [ ] Configure `CredentialsProvider` with email + password
  - [ ] Query user from DB by email
  - [ ] `bcrypt.compare()` password verification
  - [ ] Return user object with `id`, `email`, `fullName`, `role` in JWT callback
  - [ ] Session strategy: `jwt`
  - [ ] Max age: 1 hour (default), 7 days (with Remember Me — stretch)
- [ ] Create `app/api/auth/[...nextauth]/route.ts` — NextAuth handler

### 1.2 RBAC Middleware
- [ ] 🔴 Create `lib/rbac.ts`:
  - [ ] Define `Permission` type: `'full' | 'view' | 'none'`
  - [ ] Define `Module` type: `'dashboard' | 'fleet' | 'drivers' | 'trips' | 'maintenance' | 'fuel' | 'reports' | 'settings'`
  - [ ] Define `ROLE_PERMISSIONS` matrix (PRD §5.1.2):
    - Fleet Manager: dashboard=full, fleet=full, drivers=view, trips=view, maintenance=full, fuel=view, reports=full, settings=full
    - Dispatcher: dashboard=full, fleet=view, drivers=view, trips=full, maintenance=none, fuel=none, reports=view, settings=none
    - Safety Officer: dashboard=view, fleet=none, drivers=full, trips=view, maintenance=none, fuel=full, reports=view, settings=none
    - Financial Analyst: dashboard=view, fleet=view, drivers=none, trips=view, maintenance=view, fuel=full, reports=full, settings=none
  - [ ] `checkPermission(role, module, requiredLevel)` function
  - [ ] `getModulesForRole(role)` — returns visible sidebar items
- [ ] Create `middleware.ts` — redirect unauthenticated users to `/login`

### 1.3 Auth Context (Client-Side)
- [ ] Create auth context/provider for client components using `useSession()` from NextAuth
- [ ] Expose: `user`, `role`, `permissions`, `isAuthenticated`, `logout()`

### 1.4 Login Page
- [ ] 🔴 Create `app/(auth)/login/page.tsx`:
  - [ ] TransitOps logo (centered top)
  - [ ] Email input (placeholder: `name@transitops.in`, validation: required, email format)
  - [ ] Password input (type: password, toggle visibility eye icon)
  - [ ] Role selector dropdown (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst)
  - [ ] Remember Me checkbox
  - [ ] Forgot Password link (can be non-functional for hackathon)
  - [ ] Sign In button (primary, full-width)
  - [ ] Error banner for invalid credentials: _"Invalid email or password. Please try again."_
  - [ ] Loading state on submit button
  - [ ] Redirect to `/` (dashboard) on success
- [ ] Style login page:
  - [ ] Centered card layout with glassmorphism
  - [ ] Gradient background
  - [ ] Responsive on mobile

### 1.5 Auth API Endpoints
- [ ] `POST /api/auth/login` — handled by NextAuth
- [ ] `POST /api/auth/logout` — handled by NextAuth
- [ ] `GET /api/auth/me` — Create `app/api/auth/me/route.ts`:
  - [ ] Return current user, role, and permissions
  - [ ] Return 401 if not authenticated

---

## Phase 2: Layout & Navigation Shell (concurrent with Phase 1)

### 2.1 Install shadcn/ui Components
- [ ] Install core components:
  ```
  npx shadcn-ui@latest add button card input select label checkbox badge table dialog alert toast sonner tooltip dropdown-menu separator tabs progress skeleton popover textarea
  ```
- [ ] Install navigation components:
  ```
  npx shadcn-ui@latest add sidebar navigation-menu breadcrumb
  ```

### 2.2 Sidebar Navigation
- [ ] Create `components/layout/sidebar.tsx`:
  - [ ] TransitOps logo/brand at top
  - [ ] Navigation items with icons (Lucide):
    - 📊 Dashboard → `/`
    - 🚗 Vehicle Registry → `/vehicles`
    - 👤 Drivers & Safety → `/drivers`
    - 🗺️ Trip Dispatcher → `/trips`
    - 🔧 Maintenance → `/maintenance`
    - ⛽ Fuel & Expenses → `/fuel-expenses`
    - 📈 Reports & Analytics → `/reports`
    - ⚙️ Settings → `/settings`
  - [ ] Active state highlight on current route
  - [ ] RBAC filtering: hide/grey-out items based on user role
  - [ ] Logout button at bottom
  - [ ] Responsive behavior:
    - Desktop (≥1024px): Fixed, always visible
    - Tablet (768–1023px): Collapsed, icon-only
    - Mobile (<768px): Hidden, hamburger toggle

### 2.3 Header Bar
- [ ] Create `components/layout/header.tsx`:
  - [ ] Breadcrumb (current module path)
  - [ ] User avatar + name + role badge
  - [ ] ⭐ Dark mode toggle button

### 2.4 Dashboard Layout
- [ ] Create `app/(dashboard)/layout.tsx`:
  - [ ] Wrap all authenticated pages in Sidebar + Header
  - [ ] Apply RBAC guard (redirect to login if no session)
  - [ ] Apply role-based sidebar filtering

### 2.5 Mobile Navigation
- [ ] Create `components/layout/mobile-nav.tsx`:
  - [ ] Hamburger icon button (visible only on mobile)
  - [ ] Slide-out sheet/drawer with same navigation items
  - [ ] Close on navigation

---

## Phase 3: Vehicle Registry (1:00 – 2:00) — 60 min

### 3.1 Vehicle Validation Schema
- [ ] Create `lib/validations/vehicle.schema.ts`:
  - [ ] `createVehicleSchema` (Zod):
    - registrationNumber: string, min 1, max 15, regex `/^[A-Z0-9-]+$/i`
    - nameModel: string, min 1, max 50
    - type: enum [Van, Truck, Mini, Bus, Sedan]
    - maxLoadCapacity: number, positive, max 50000
    - odometer: number, nonnegative, optional, default 0
    - acquisitionCost: number, nonnegative, optional, default 0
    - region: string, optional
  - [ ] `updateVehicleSchema` — same but registrationNumber is optional/immutable

### 3.2 Vehicle Service Layer
- [ ] Create `lib/services/vehicle.service.ts`:
  - [ ] `getAllVehicles(filters?)` — list with filters (type, status, region, search)
  - [ ] `getVehicleById(id)` — single vehicle with relations
  - [ ] `getAvailableVehicles()` — `WHERE status = 'Available'` (for dispatch dropdown)
  - [ ] `createVehicle(data)` — validate uniqueness of registration_number, default status "Available"
  - [ ] `updateVehicle(id, data)` — prevent editing registrationNumber, prevent manual status change
  - [ ] `retireVehicle(id)` — set status to "Retired" (only if not On Trip)

### 3.3 Vehicle API Routes
- [ ] 🔴 Create `app/api/vehicles/route.ts`:
  - [ ] `GET` — list all vehicles with query params (type, status, region, search, page, limit)
  - [ ] `POST` — create vehicle (RBAC: Fleet Manager only)
    - Validate with Zod schema
    - Check registration_number uniqueness
    - Return 409 if duplicate
- [ ] Create `app/api/vehicles/[id]/route.ts`:
  - [ ] `GET` — single vehicle
  - [ ] `PUT` — update vehicle (RBAC: Fleet Manager only)
- [ ] Create `app/api/vehicles/[id]/retire/route.ts`:
  - [ ] `PATCH` — retire vehicle (RBAC: Fleet Manager only)
- [ ] Create `app/api/vehicles/available/route.ts`:
  - [ ] `GET` — only available vehicles (for dispatch dropdown)

### 3.4 Vehicle UI Components
- [ ] Create `components/shared/status-badge.tsx` — reusable colored badge:
  - Available → green
  - On Trip → blue
  - In Shop → orange
  - Retired → grey
- [ ] Create `components/shared/data-table.tsx` — generic sortable/filterable table wrapper
- [ ] Create `components/vehicles/vehicle-table.tsx`:
  - [ ] Columns: Registration Number, Name/Model, Type, Max Capacity, Odometer, Acquisition Cost, Status (badge)
  - [ ] Row actions: View, Edit (Fleet Manager), Retire (Fleet Manager)
  - [ ] Sorting on each column
  - [ ] Pagination
- [ ] Create `components/vehicles/vehicle-form-modal.tsx`:
  - [ ] Dialog/Modal with form fields:
    - Registration Number (disabled on edit)
    - Vehicle Name/Model
    - Type (dropdown)
    - Max Capacity (kg) (number input)
    - Odometer (km) (number input)
    - Acquisition Cost (₹) (number input)
  - [ ] Client-side validation (Zod)
  - [ ] Inline error messages under each field
  - [ ] Submit → POST (create) or PUT (edit)
  - [ ] Loading state on submit
  - [ ] Success toast notification
  - [ ] Close modal + refresh table on success

### 3.5 Vehicle Page
- [ ] 🔴 Create `app/(dashboard)/vehicles/page.tsx`:
  - [ ] Page title: "Vehicle Registry"
  - [ ] Action bar:
    - Search input (searches registration number + name/model)
    - Type filter dropdown
    - Status filter dropdown
    - `+ Add Vehicle` button (visible only for Fleet Manager)
  - [ ] Vehicle table
  - [ ] Add/Edit modal

### 3.6 Business Rules Enforcement (Vehicle)
- [ ] 🔴 BR-01: Registration number uniqueness — DB unique constraint + API 409 error
- [ ] Status field is read-only in forms (system-managed)
- [ ] New vehicles default to `Available`
- [ ] Retired vehicles cannot be un-retired (no UI for it, API rejects)
- [ ] Retire only if vehicle is not `On Trip`

---

## Phase 4: Driver Management (2:00 – 2:45) — 45 min

### 4.1 Driver Validation Schema
- [ ] Create `lib/validations/driver.schema.ts`:
  - [ ] `createDriverSchema` (Zod):
    - name: string, min 1, max 100
    - licenseNumber: string, min 1, unique
    - licenseCategory: enum [LMV, HMV, HGV]
    - licenseExpiry: date, required
    - contactNumber: string, min 10, max 15
    - safetyScore: number, 0-100, optional, default 100

### 4.2 Driver Service Layer
- [ ] Create `lib/services/driver.service.ts`:
  - [ ] `getAllDrivers(filters?)` — list with filters (status, search)
  - [ ] `getDriverById(id)` — single driver
  - [ ] `getEligibleDrivers()` — `WHERE status = 'Available' AND license_expiry > NOW()`
  - [ ] `createDriver(data)` — validate uniqueness of license_number, default status "Available"
  - [ ] `updateDriver(id, data)` — prevent manual status change
  - [ ] `suspendDriver(id)` — set status to "Suspended" (only if not On Trip)
  - [ ] `reinstateDriver(id)` — set status back to "Available"

### 4.3 Driver API Routes
- [ ] 🔴 Create `app/api/drivers/route.ts`:
  - [ ] `GET` — list all drivers with filters
  - [ ] `POST` — create driver (RBAC: Safety Officer only)
- [ ] Create `app/api/drivers/[id]/route.ts`:
  - [ ] `GET` — single driver
  - [ ] `PUT` — update driver (RBAC: Safety Officer)
- [ ] Create `app/api/drivers/[id]/suspend/route.ts`:
  - [ ] `PATCH` — suspend driver (RBAC: Safety Officer)
- [ ] Create `app/api/drivers/[id]/reinstate/route.ts`:
  - [ ] `PATCH` — reinstate driver (RBAC: Safety Officer)
- [ ] Create `app/api/drivers/eligible/route.ts`:
  - [ ] `GET` — eligible for dispatch (status=Available, license not expired)

### 4.4 Driver UI Components
- [ ] Create `components/drivers/compliance-badge.tsx`:
  - [ ] `Valid DL` (green) — expiry > 30 days away
  - [ ] `Expiring Soon` (yellow) — expiry ≤ 30 days away
  - [ ] `Expired DL` (red) — expiry date passed
  - [ ] `Suspended` (red) — status is Suspended
- [ ] Create `components/drivers/driver-table.tsx`:
  - [ ] Columns: Name, License No., License Category, License Expiry (red highlight if ≤30 days), Compliance Status (badge), Safety Score (color-coded: ≥80 green, 50-79 yellow, <50 red), Status (badge)
  - [ ] Row actions: View, Edit (Safety Officer), Suspend/Reinstate (Safety Officer)
  - [ ] Sorting + pagination
- [ ] Create `components/drivers/driver-form-modal.tsx`:
  - [ ] Dialog with form fields:
    - Full Name
    - License Number
    - License Category (dropdown)
    - License Expiry Date (date picker)
    - Contact Number
    - Initial Safety Score (default 100)
  - [ ] Client-side validation
  - [ ] Submit + refresh

### 4.5 Driver Page
- [ ] 🔴 Create `app/(dashboard)/drivers/page.tsx`:
  - [ ] Page title: "Drivers & Safety"
  - [ ] Action bar:
    - Search (name, license number)
    - Status filter dropdown
    - `+ Add Driver` button (Safety Officer only)
  - [ ] Driver table
  - [ ] Add/Edit modal

---

## Phase 5: Trip Dispatcher (2:45 – 3:45) — 60 min ⚡ Most Critical

### 5.1 Trip Validation Schema
- [ ] Create `lib/validations/trip.schema.ts`:
  - [ ] `createTripSchema` (Zod):
    - source: string, min 1
    - destination: string, min 1
    - vehicleId: number, int, positive
    - driverId: number, int, positive
    - cargoWeight: number, positive
    - plannedDistance: number, positive
  - [ ] `completeTripSchema`:
    - endOdometer: number, nonnegative
    - fuelConsumed: number, positive

### 5.2 Trip Service Layer (Business Rules Heavy)
- [ ] 🔴 Create `lib/services/trip.service.ts`:
  - [ ] `getAllTrips(filters?)` — list with filters (status, vehicle, driver)
  - [ ] `getTripById(id)` — single trip with vehicle + driver relations
  - [ ] `createTrip(data, userId)`:
    - Auto-generate trip_code (e.g., `TRP-XXXXX`)
    - Status defaults to "Draft"
    - 🔴 Validate cargo_weight ≤ vehicle.max_load_capacity (BR-07)
    - 🔴 Validate vehicle.status == 'Available' (BR-06)
    - 🔴 Validate driver.status == 'Available' (BR-05)
    - 🔴 Validate driver.license_expiry > now() (BR-03)
    - 🔴 Validate driver.status != 'Suspended' (BR-04)
  - [ ] `dispatchTrip(id)` — 🔴 ATOMIC TRANSACTION:
    - Set trip.status → "Dispatched"
    - Set trip.dispatched_at → now()
    - Set vehicle.status → "On Trip" (BR-08)
    - Set driver.status → "On Trip" (BR-09)
    - Record start_odometer from vehicle.odometer
  - [ ] `completeTrip(id, data)` — 🔴 ATOMIC TRANSACTION:
    - Set trip.status → "Completed"
    - Set trip.completed_at → now()
    - Set trip.end_odometer, trip.fuel_consumed, trip.actual_distance (auto-calc)
    - Set vehicle.status → "Available" (BR-10)
    - Set vehicle.odometer → end_odometer
    - Set driver.status → "Available" (BR-11)
    - Auto-create fuel log entry
  - [ ] `cancelTrip(id)` — 🔴 ATOMIC TRANSACTION:
    - Set trip.status → "Cancelled"
    - Set trip.cancelled_at → now()
    - If trip was "Dispatched":
      - Set vehicle.status → "Available" (BR-12)
      - Set driver.status → "Available" (BR-13)

### 5.3 Trip API Routes
- [ ] 🔴 Create `app/api/trips/route.ts`:
  - [ ] `GET` — list all trips
  - [ ] `POST` — create trip (Draft) with all validations (RBAC: Dispatcher)
- [ ] Create `app/api/trips/[id]/route.ts`:
  - [ ] `GET` — single trip with relations
- [ ] 🔴 Create `app/api/trips/[id]/dispatch/route.ts`:
  - [ ] `POST` — dispatch trip (atomic transaction)
- [ ] 🔴 Create `app/api/trips/[id]/complete/route.ts`:
  - [ ] `POST` — complete trip with odometer + fuel (atomic transaction)
- [ ] 🔴 Create `app/api/trips/[id]/cancel/route.ts`:
  - [ ] `POST` — cancel trip (atomic transaction)

### 5.4 Trip UI Components
- [ ] Create `components/trips/trip-table.tsx`:
  - [ ] Columns: Trip ID (TRP-XXXXX), Vehicle (name + reg), Driver (name), Source → Destination, Cargo (kg), Status (badge), Created Date
  - [ ] Status badges with colors: Draft=grey, Dispatched=blue, Completed=green, Cancelled=red
  - [ ] Row actions per status:
    - Draft: Dispatch, Cancel
    - Dispatched: Complete, Cancel
    - Completed/Cancelled: View only
- [ ] Create `components/trips/trip-form.tsx`:
  - [ ] Source input (text/autocomplete)
  - [ ] Destination input (text/autocomplete)
  - [ ] Vehicle dropdown (only Available vehicles — fetch from `/api/vehicles/available`)
  - [ ] Driver dropdown (only eligible drivers — fetch from `/api/drivers/eligible`)
  - [ ] Cargo Weight (kg) input
  - [ ] Planned Distance (km) input
  - [ ] 🔴 Real-time capacity validation:
    - On vehicle select → fetch vehicle.max_load_capacity
    - On cargo weight change → compare with selected vehicle capacity
    - If cargo > capacity → disable Dispatch button + show red warning banner with exact overage
  - [ ] Submit → creates Draft trip
- [ ] Create `components/trips/trip-completion-modal.tsx`:
  - [ ] Final Odometer (km) input
  - [ ] Fuel Consumed (liters) input
  - [ ] Actual Distance (auto-calculated from odometer diff)
  - [ ] Notes (optional textarea)
  - [ ] Submit → calls complete API

### 5.5 Trip Page
- [ ] 🔴 Create `app/(dashboard)/trips/page.tsx`:
  - [ ] Page title: "Trip Dispatcher"
  - [ ] Action bar:
    - Status filter
    - `+ New Trip` button (Dispatcher only)
  - [ ] Trip table with inline action buttons
  - [ ] New Trip form (modal or side panel)
  - [ ] Completion modal

### 5.6 Business Rules Verification Checklist
- [ ] 🔴 BR-02: Retired/In Shop vehicles NOT in dispatch dropdown → verify vehicle dropdown query
- [ ] 🔴 BR-03: Expired license driver NOT in dispatch dropdown → verify driver dropdown query
- [ ] 🔴 BR-04: Suspended driver NOT in dispatch dropdown → verify
- [ ] 🔴 BR-05: On Trip driver NOT in dispatch dropdown → verify
- [ ] 🔴 BR-06: On Trip vehicle NOT in dispatch dropdown → verify
- [ ] 🔴 BR-07: Cargo > capacity → dispatch blocked with error message → verify
- [ ] 🔴 BR-08: Dispatch → vehicle.status = "On Trip" → verify
- [ ] 🔴 BR-09: Dispatch → driver.status = "On Trip" → verify
- [ ] 🔴 BR-10: Complete → vehicle.status = "Available" → verify
- [ ] 🔴 BR-11: Complete → driver.status = "Available" → verify
- [ ] 🔴 BR-12: Cancel dispatched → vehicle.status = "Available" → verify
- [ ] 🔴 BR-13: Cancel dispatched → driver.status = "Available" → verify

---

## Phase 6: Maintenance (3:45 – 4:15) — 30 min

### 6.1 Maintenance Validation Schema
- [ ] Create `lib/validations/maintenance.schema.ts`:
  - [ ] `createMaintenanceSchema`:
    - vehicleId: number, int, positive
    - serviceType: enum [Oil Change, Tire Replacement, Engine Repair, Brake Service, General Inspection, Other]
    - description: string, optional
    - cost: number, nonnegative

### 6.2 Maintenance Service Layer
- [ ] Create `lib/services/maintenance.service.ts`:
  - [ ] `getAllMaintenanceLogs(filters?)` — list with filters
  - [ ] `createMaintenanceRecord(data)` — 🔴 ATOMIC TRANSACTION:
    - Auto-generate record_code (e.g., `MNT-XXXX`)
    - Set status "Active"
    - 🔴 Set vehicle.status → "In Shop" (BR-14)
    - Reject if vehicle is currently On Trip (queue or error)
  - [ ] `closeMaintenanceRecord(id)` — 🔴 ATOMIC TRANSACTION:
    - Set maintenance.status → "Closed"
    - Set maintenance.closed_at → now()
    - 🔴 Set vehicle.status → "Available" (BR-15) — unless retire flag is set → "Retired"

### 6.3 Maintenance API Routes
- [ ] Create `app/api/maintenance/route.ts`:
  - [ ] `GET` — list all maintenance logs
  - [ ] `POST` — create record (RBAC: Fleet Manager)
- [ ] Create `app/api/maintenance/[id]/close/route.ts`:
  - [ ] `PATCH` — close record (RBAC: Fleet Manager)

### 6.4 Maintenance UI Components
- [ ] Create `components/maintenance/maintenance-table.tsx`:
  - [ ] Columns: Record ID, Vehicle (reg + model), Service Type, Description, Cost (₹), Status (Active=orange, Closed=green), Created Date, Closed Date
  - [ ] Row actions: Close Record (Fleet Manager only, only for Active records)
- [ ] Create `components/maintenance/maintenance-form-modal.tsx`:
  - [ ] Vehicle dropdown (Available + On Trip vehicles — NOT In Shop, NOT Retired)
  - [ ] Service Type dropdown
  - [ ] Description textarea
  - [ ] Estimated Cost input
  - [ ] Submit → create + auto status transition

### 6.5 Maintenance Page
- [ ] Create `app/(dashboard)/maintenance/page.tsx`:
  - [ ] Page title: "Maintenance"
  - [ ] `+ New Service Record` button (Fleet Manager only)
  - [ ] Maintenance table
  - [ ] Create modal

### 6.6 Business Rules Verification
- [ ] 🔴 BR-14: Creating active maintenance → vehicle.status = "In Shop" → verify
- [ ] 🔴 BR-15: Closing maintenance → vehicle.status = "Available" → verify
- [ ] In Shop vehicle disappears from trip dispatch dropdown → verify

---

## Phase 7: Fuel & Expense Management (4:15 – 5:00) — 45 min

### 7.1 Fuel Validation Schema
- [ ] Create `lib/validations/fuel.schema.ts`:
  - [ ] `createFuelLogSchema`:
    - vehicleId: number, int, positive
    - logDate: date, required, ≤ today
    - liters: number, positive
    - costPerLiter: number, positive
    - odometerAtFill: number, nonnegative, optional
  - [ ] `createExpenseSchema`:
    - tripId: number, optional
    - vehicleId: number, int, positive
    - category: enum [Toll, Parking, Penalty, Repair, Miscellaneous]
    - amount: number, positive
    - expenseDate: date, required
    - description: string, optional

### 7.2 Fuel & Expense Service Layer
- [ ] Create `lib/services/fuel.service.ts`:
  - [ ] `getAllFuelLogs(filters?)` — list with filters
  - [ ] `createFuelLog(data)`:
    - Auto-generate log_code (e.g., `FUEL-XXXX`)
    - Auto-calculate total_cost = liters × costPerLiter
    - Default approval_status = "Pending"
  - [ ] `getAllExpenses(filters?)` — list with filters
  - [ ] `createExpense(data)`:
    - Auto-generate expense_code (e.g., `EXP-XXXX`)
    - Default approval_status = "Pending"
  - [ ] `approveFuelLog(id, userId)` — set approval_status = "Approved"
  - [ ] `rejectFuelLog(id, userId)` — set approval_status = "Rejected"
  - [ ] `approveExpense(id, userId)` — set approval_status = "Approved"
  - [ ] `rejectExpense(id, userId)` — set approval_status = "Rejected"
  - [ ] `getOperationalCostPerVehicle(vehicleId)`:
    - `Σ(Fuel Costs) + Σ(Maintenance Costs) + Σ(Other Expenses)`

### 7.3 Fuel & Expense API Routes
- [ ] Create `app/api/fuel-logs/route.ts`:
  - [ ] `GET` — list all fuel logs
  - [ ] `POST` — create fuel log (RBAC: Safety Officer, Financial Analyst)
- [ ] Create `app/api/fuel-logs/[id]/approve/route.ts`:
  - [ ] `PATCH` — approve/reject (RBAC: Financial Analyst, Fleet Manager)
- [ ] Create `app/api/expenses/route.ts`:
  - [ ] `GET` — list all expenses
  - [ ] `POST` — create expense (RBAC: Safety Officer, Financial Analyst)
- [ ] Create `app/api/expenses/[id]/approve/route.ts`:
  - [ ] `PATCH` — approve/reject (RBAC: Financial Analyst, Fleet Manager)

### 7.4 Fuel & Expense UI Components
- [ ] Create `components/fuel-expenses/fuel-log-table.tsx`:
  - [ ] Columns: Log ID, Vehicle, Date, Fuel (L), Cost/L (₹), Total Cost (₹), Odometer, Approval Status (badge)
  - [ ] Row actions: Approve/Reject (Financial Analyst, Fleet Manager only)
- [ ] Create `components/fuel-expenses/expense-table.tsx`:
  - [ ] Columns: Expense ID, Trip, Vehicle, Category, Amount (₹), Date, Description, Approval Status (badge)
  - [ ] Row actions: Approve/Reject
- [ ] Create `components/fuel-expenses/fuel-form-modal.tsx`:
  - [ ] Vehicle dropdown, Date picker, Fuel Quantity, Cost per Liter, Odometer Reading
  - [ ] Auto-calculate Total Cost display
- [ ] Create `components/fuel-expenses/expense-form-modal.tsx`:
  - [ ] Trip dropdown (optional), Vehicle dropdown, Category dropdown, Amount, Date, Description

### 7.5 Fuel & Expenses Page
- [ ] Create `app/(dashboard)/fuel-expenses/page.tsx`:
  - [ ] Page title: "Fuel & Expenses"
  - [ ] Tabbed layout (shadcn Tabs):
    - Tab 1: Fuel Logs — table + `+ Log Fuel` button
    - Tab 2: Expenses — table + `+ Log Expense` button
  - [ ] Respective modals for each tab

---

## Phase 8: Dashboard (5:00 – 5:45) — 45 min

### 8.1 Dashboard API
- [ ] Create `app/api/reports/dashboard/route.ts`:
  - [ ] `GET` — return KPI data:
    - activeVehicles: `COUNT(vehicles WHERE status = 'On Trip')`
    - availableVehicles: `COUNT(vehicles WHERE status = 'Available')`
    - vehiclesInMaintenance: `COUNT(vehicles WHERE status = 'In Shop')`
    - activeTrips: `COUNT(trips WHERE status = 'Dispatched')`
    - pendingTrips: `COUNT(trips WHERE status = 'Draft')`
    - driversOnDuty: `COUNT(drivers WHERE status = 'On Trip')`
    - fleetUtilization: `(On Trip / Total Non-Retired) × 100`
    - recentTrips: `trips ORDER BY created_at DESC LIMIT 10` (with vehicle + driver joins)
    - vehicleStatusDistribution: `GROUP BY status → [{status, count}]`

### 8.2 Dashboard KPI Cards
- [ ] Create `components/dashboard/kpi-card.tsx`:
  - [ ] Icon (Lucide)
  - [ ] Large numeric value (28px bold, Outfit font)
  - [ ] Label (14px medium)
  - [ ] Color-themed background (subtle glassmorphism)
  - [ ] Animated count-up on page load
  - [ ] Hover lift effect (transform: translateY(-2px))
- [ ] Render 7 KPI cards in responsive grid:
  - Active Vehicles (blue)
  - Available Vehicles (green)
  - In Maintenance (orange)
  - Active Trips (purple)
  - Pending Trips (yellow)
  - Drivers on Duty (teal)
  - Fleet Utilization % (gradient)

### 8.3 Dashboard Charts
- [ ] Create `components/dashboard/vehicle-status-chart.tsx`:
  - [ ] Recharts `PieChart` (donut variant with inner radius)
  - [ ] Segments: Available, On Trip, In Shop, Retired (with chart-colors)
  - [ ] Hover tooltips with count + percentage
  - [ ] Legend below chart
- [ ] Dynamic import Recharts: `const Chart = dynamic(() => import('./vehicle-status-chart'), { ssr: false })`

### 8.4 Dashboard Recent Trips
- [ ] Create `components/dashboard/recent-trips-table.tsx`:
  - [ ] Columns: Trip ID, Vehicle, Driver, Source → Destination, Status (badge), Created Date
  - [ ] Status badges with PRD colors (Draft=grey, Dispatched=blue, Completed=green, Cancelled=red)
  - [ ] Show last 10 trips

### 8.5 Dashboard Filters
- [ ] Add filter bar to dashboard:
  - [ ] Vehicle Type multi-select
  - [ ] Status multi-select
  - [ ] Region dropdown
  - [ ] Date Range picker

### 8.6 Dashboard Page
- [ ] 🔴 Create `app/(dashboard)/page.tsx`:
  - [ ] Page title: "Dashboard"
  - [ ] Filter bar (top)
  - [ ] 7 KPI cards (responsive grid — 4 cols desktop, 2 cols tablet, 1 col mobile)
  - [ ] Vehicle Status Chart (left) + Recent Trips Table (right) — side by side on desktop, stacked on mobile

---

## Phase 9: Reports & Analytics (5:45 – 6:30) — 45 min

### 9.1 Reports API Routes
- [ ] Create `app/api/reports/fuel-efficiency/route.ts`:
  - [ ] `GET` — per-vehicle: `Total Distance ÷ Total Fuel Consumed` (km/L)
- [ ] Create `app/api/reports/operational-cost/route.ts`:
  - [ ] `GET` — per-vehicle: `Σ(Fuel + Maintenance + Expenses)`
- [ ] Create `app/api/reports/vehicle-roi/route.ts`:
  - [ ] `GET` — per-vehicle: `(Revenue - (Maintenance + Fuel)) ÷ Acquisition Cost × 100`

### 9.2 Report KPI Summary
- [ ] Create `components/reports/kpi-summary.tsx`:
  - [ ] 4 summary cards:
    - Fuel Efficiency (km/L)
    - Fleet Utilization (%)
    - Total Operational Cost (₹)
    - Average Vehicle ROI (%)
  - [ ] Each with icon + value + label

### 9.3 Report Charts
- [ ] Create `components/reports/revenue-chart.tsx`:
  - [ ] Recharts `BarChart` (vertical) — monthly revenue trend
- [ ] Create `components/reports/cost-chart.tsx`:
  - [ ] Recharts `BarChart` (horizontal, layout="vertical") — top costliest vehicles
- [ ] Create `components/reports/efficiency-chart.tsx`:
  - [ ] Recharts `LineChart` — fuel efficiency by vehicle over time
- [ ] Create `components/reports/trip-distribution-chart.tsx`:
  - [ ] Recharts `PieChart` (donut) — trip status distribution
- [ ] Create `components/reports/safety-chart.tsx`:
  - [ ] Recharts `BarChart` (horizontal) — driver safety scores

### 9.4 CSV Export
- [ ] 🔴 Create `app/api/reports/export/csv/route.ts`:
  - [ ] Accept `?module=vehicles|drivers|trips|fuel|expenses|maintenance`
  - [ ] Fetch filtered data
  - [ ] Convert to CSV using `@json2csv/plainjs`
  - [ ] Return CSV file with headers:
    - Content-Type: `text/csv`
    - Content-Disposition: `attachment; filename="transitops_{module}_{date}.csv"`
- [ ] Create `components/reports/export-button.tsx`:
  - [ ] `📥 Export CSV` button
  - [ ] Dropdown to select module
  - [ ] Trigger download on click

### 9.5 Reports Page
- [ ] Create `app/(dashboard)/reports/page.tsx`:
  - [ ] Page title: "Reports & Analytics"
  - [ ] Filters: Date Range, Vehicle, Vehicle Type, Region
  - [ ] 4 KPI summary cards (top)
  - [ ] Charts grid (2×2 or 3-column layout):
    - Monthly Revenue Trend
    - Top Costliest Vehicles
    - Fuel Efficiency by Vehicle
    - Trip Status Distribution
    - Driver Safety Scores
  - [ ] Export CSV button

---

## Phase 10: Settings & RBAC Configuration (6:30 – 7:00) — 30 min

### 10.1 Settings Page
- [ ] Create `app/(dashboard)/settings/page.tsx`:
  - [ ] Page title: "Settings"
  - [ ] Two sections:

### 10.2 General Settings Section
- [ ] Organization Name input (default: "TransitOps HQ")
- [ ] Currency dropdown (₹ INR, $ USD, € EUR)
- [ ] Distance Unit toggle (km / miles)
- [ ] Date Format dropdown (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
- [ ] Timezone dropdown (Asia/Kolkata default)
- [ ] Save button

### 10.3 RBAC Permission Matrix Section
- [ ] Interactive table:
  - Rows: Fleet, Drivers, Trips, Fuel/Expenses, Analytics
  - Columns: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst
  - Each cell: dropdown with `Full Access` / `View Only` / `No Access`
- [ ] Pre-filled with default permissions from PRD §5.1.2
- [ ] Save button → updates `roles.permissions` JSON in DB
- [ ] Only visible to Fleet Manager

---

## Phase 11: UI Polish & Dark Mode (7:00 – 7:30) — 30 min

### 11.1 Dark Mode
- [ ] ⭐ Create dark mode toggle component (sun/moon icon in header)
- [ ] Store preference in localStorage
- [ ] Check `prefers-color-scheme` on first visit
- [ ] Toggle `dark` class on `<html>` element
- [ ] Verify all shadcn/ui components render correctly in dark mode
- [ ] Verify charts have readable colors in dark mode

### 11.2 Responsive Fixes
- [ ] Test all pages at 375px (mobile)
- [ ] Test all pages at 768px (tablet)
- [ ] Test all pages at 1440px (desktop)
- [ ] Fix any overflow/layout issues
- [ ] Verify modals are scrollable on small screens
- [ ] Verify tables have horizontal scroll on mobile

### 11.3 Animations & Micro-interactions
- [ ] KPI card count-up animation on dashboard
- [ ] Hover lift effect on cards (transform + shadow transition)
- [ ] Status badge pulse animation for "On Trip" / "Dispatched" statuses
- [ ] Modal enter/exit transitions (fade + scale)
- [ ] Toast notifications (sonner) for success/error actions
- [ ] Button loading spinners during API calls
- [ ] Skeleton loaders while data fetches

### 11.4 Visual Polish
- [ ] Consistent spacing and padding across all pages
- [ ] Glassmorphism on KPI cards (backdrop-blur + semi-transparent bg)
- [ ] Gradient accents on primary elements
- [ ] Proper empty states (no data illustrations or messages)
- [ ] Error states with helpful messages
- [ ] Loading states on all data-fetching pages

---

## Phase 12: Testing & Demo Prep (7:30 – 8:00) — 30 min

### 12.1 End-to-End Workflow Test (from PRD §14.2)
- [ ] 🔴 Step 1: Register vehicle `Van-05` (capacity: 500 kg) → verify status = Available
- [ ] 🔴 Step 2: Register driver `Alex` (valid license) → verify status = Available
- [ ] 🔴 Step 3: Create trip with cargo = 450 kg → verify 450 ≤ 500 validation passes
- [ ] 🔴 Step 4: Dispatch trip → verify vehicle + driver status → "On Trip"
- [ ] 🔴 Step 5: Try assigning same vehicle to another trip → verify blocked
- [ ] 🔴 Step 6: Complete trip (enter odometer + fuel) → verify vehicle + driver → "Available"
- [ ] 🔴 Step 7: Create maintenance (Oil Change) → verify vehicle → "In Shop"
- [ ] 🔴 Step 8: Verify vehicle hidden from dispatch dropdown
- [ ] 🔴 Step 9: Close maintenance → verify vehicle → "Available"
- [ ] 🔴 Step 10: Check dashboard KPIs match DB counts
- [ ] 🔴 Step 11: Check reports updated with operational cost + fuel efficiency

### 12.2 Acceptance Tests (from PRD §14.1)
- [ ] AC-01: Login with valid Fleet Manager credentials → lands on Dashboard
- [ ] AC-02: Login with invalid credentials → shows error banner
- [ ] AC-03: Register vehicle with duplicate reg number → shows "already exists" error
- [ ] AC-04: Trip with cargo=450kg, capacity=500kg → dispatch allowed
- [ ] AC-05: Trip with cargo=600kg, capacity=500kg → blocked with "exceeded by 100 kg"
- [ ] AC-06: Dispatch trip → both vehicle + driver become "On Trip"
- [ ] AC-07: On Trip vehicle not in dispatch dropdown
- [ ] AC-08: Expired license driver not in dispatch dropdown
- [ ] AC-09: Complete trip → both become Available, fuel log created
- [ ] AC-10: Cancel dispatched trip → both become Available
- [ ] AC-11: Create maintenance → vehicle becomes "In Shop", hidden from dispatch
- [ ] AC-12: Close maintenance → vehicle becomes "Available"
- [ ] AC-13: Dashboard KPIs are accurate
- [ ] AC-14: Dispatcher cannot access Maintenance page
- [ ] AC-15: CSV export works correctly

### 12.3 RBAC Smoke Tests
- [ ] Login as Fleet Manager → can access Fleet, Maintenance, Settings, Reports
- [ ] Login as Dispatcher → can access Trips, Dashboard; cannot access Maintenance
- [ ] Login as Safety Officer → can access Drivers, Fuel; cannot access Fleet CRUD
- [ ] Login as Financial Analyst → can access Reports, Fuel; cannot access Drivers CRUD

### 12.4 Demo Data Verification
- [ ] Seed data is populated and realistic
- [ ] Dashboard shows non-zero KPIs on first load
- [ ] Charts render with visible data
- [ ] All tables have data rows
- [ ] Login credentials documented for demo:
  - Fleet Manager: `priya@transitops.in` / `Password@123`
  - Dispatcher: `raven@transitops.in` / `Password@123`
  - Safety Officer: `carlos@transitops.in` / `Password@123`
  - Financial Analyst: `maya@transitops.in` / `Password@123`

### 12.5 Final Checklist
- [ ] App runs without console errors
- [ ] All API endpoints return correct responses
- [ ] No broken links in sidebar navigation
- [ ] SEO meta tags set (title: "TransitOps — Smart Transport Operations")
- [ ] Favicon set
- [ ] README.md updated with:
  - [ ] Project description
  - [ ] Setup instructions (install, migrate, seed, run)
  - [ ] Demo credentials
  - [ ] Tech stack summary
  - [ ] Screenshots (if time)

---

## Bonus Features (Time Permitting) ⭐

### B.1 PDF Export
- [ ] ⭐ Install `html2pdf.js` or `@react-pdf/renderer`
- [ ] ⭐ Add `📥 Export PDF` button to Reports page
- [ ] ⭐ Generate formatted PDF with KPIs, charts, tables

### B.2 Email Reminders (License Expiry)
- [ ] ⭐ Install `nodemailer`
- [ ] ⭐ Create `/api/cron/license-expiry` endpoint
- [ ] ⭐ Query drivers where `license_expiry <= NOW() + 30 days`
- [ ] ⭐ Send email notification to Safety Officer

### B.3 Vehicle Document Management
- [ ] ⭐ Add file upload field to Vehicle form (insurance, registration, PUC)
- [ ] ⭐ Display uploaded documents in vehicle detail view
- [ ] ⭐ Store in `public/uploads/` with vehicle registration prefix

### B.4 Advanced Search & Filters
- [ ] ⭐ Debounced search (300ms delay) across all tables
- [ ] ⭐ Multi-column sorting
- [ ] ⭐ URL-based filter persistence (query params)

### B.5 Map Integration (Trip Dispatcher)
- [ ] ⭐ Install `react-leaflet` + `leaflet`
- [ ] ⭐ Display trip routes on interactive map
- [ ] ⭐ Vehicle markers color-coded by status
- [ ] ⭐ Split-view layout (map left, form right)

---

## Summary — Sprint Timeline

| Phase | Time | Duration | Tasks | Status |
|---|---|---|---|---|
| **Phase 0** | 0:00 – 0:30 | 30 min | Project setup, DB schema, seed data | [ ] |
| **Phase 1** | 0:30 – 1:00 | 30 min | Auth + RBAC + login page | [ ] |
| **Phase 2** | (parallel) | — | Layout shell, sidebar, header | [ ] |
| **Phase 3** | 1:00 – 2:00 | 60 min | Vehicle Registry CRUD | [ ] |
| **Phase 4** | 2:00 – 2:45 | 45 min | Driver Management CRUD | [ ] |
| **Phase 5** | 2:45 – 3:45 | 60 min | Trip Dispatcher + ALL 15 business rules | [ ] |
| **Phase 6** | 3:45 – 4:15 | 30 min | Maintenance workflow | [ ] |
| **Phase 7** | 4:15 – 5:00 | 45 min | Fuel & Expense tracking | [ ] |
| **Phase 8** | 5:00 – 5:45 | 45 min | Dashboard KPIs + charts | [ ] |
| **Phase 9** | 5:45 – 6:30 | 45 min | Reports & Analytics + CSV export | [ ] |
| **Phase 10** | 6:30 – 7:00 | 30 min | Settings & RBAC config page | [ ] |
| **Phase 11** | 7:00 – 7:30 | 30 min | UI polish, dark mode, responsive | [ ] |
| **Phase 12** | 7:30 – 8:00 | 30 min | Testing, verification, demo prep | [ ] |
| **Bonus** | If ahead | — | PDF export, email, map, docs | [ ] |

---

> 🏁 **Total: ~200 tasks. Focus on 🔴 Critical items first — they are the 15 mandatory business rules and core CRUD. Everything else enhances the demo but won't break the submission.**
