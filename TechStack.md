# TransitOps — Technology Stack Document

**Version**: 1.0  
**Date**: July 12, 2026  
**Derived From**: [PRD.md](./PRD.md)  
**Constraint**: 8-Hour Hackathon Sprint — every choice optimizes for **speed-to-demo** without sacrificing mandatory requirements.

---

## Table of Contents

1. [Stack Overview](#1-stack-overview)
2. [Frontend Layer](#2-frontend-layer)
3. [Backend Layer](#3-backend-layer)
4. [Database Layer](#4-database-layer)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Data Visualization & Charts](#6-data-visualization--charts)
7. [File Handling & Exports](#7-file-handling--exports)
8. [Validation & Type Safety](#8-validation--type-safety)
9. [Styling & Design System](#9-styling--design-system)
10. [Development Tools](#10-development-tools)
11. [Project Structure](#11-project-structure)
12. [Environment Variables](#12-environment-variables)
13. [Dependency Manifest](#13-dependency-manifest)
14. [PRD → Package Traceability Matrix](#14-prd--package-traceability-matrix)
15. [Deployment Strategy](#15-deployment-strategy)
16. [Performance & Optimization](#16-performance--optimization)

---

## 1. Stack Overview

### Architecture: Full-Stack Monolith (Next.js)

```
┌──────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                  │
│  Next.js App Router │ React 18 │ Tailwind │ shadcn/ui │
├──────────────────────────────────────────────────────┤
│                    API LAYER (Server)                  │
│     Next.js Route Handlers │ NextAuth.js │ Zod        │
├──────────────────────────────────────────────────────┤
│                   DATA LAYER (ORM)                    │
│            Prisma ORM │ Prisma Client                 │
├──────────────────────────────────────────────────────┤
│                   DATABASE                            │
│           PostgreSQL (Production/Demo)                │
│           SQLite (Local Dev Fallback)                 │
└──────────────────────────────────────────────────────┘
```

### Why This Stack?

| Decision | Rationale |
|---|---|
| **Single repo, single deploy** | 8-hour constraint — no time for separate frontend/backend repos |
| **Next.js App Router** | Server Components reduce client JS, API routes are co-located |
| **Prisma ORM** | Type-safe DB queries, auto-generated types, migration tooling |
| **PostgreSQL** | Production-grade, matches Odoo ecosystem, handles transactions natively |
| **shadcn/ui** | Copy-paste components (not npm dependency), fully customizable, accessible |
| **Tailwind CSS** | Utility-first CSS, zero naming overhead, instant responsive design |

---

## 2. Frontend Layer

### 2.1 Framework

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | `14.2.x` | React meta-framework (App Router, SSR, API routes) |
| **React** | `18.3.x` | UI component library |
| **React DOM** | `18.3.x` | DOM rendering |
| **TypeScript** | `5.5.x` | Static typing across frontend + backend |

**Why Next.js 14 (not 15)?**  
Next.js 14 is the battle-tested stable release. The App Router is mature, community support is vast, and shadcn/ui templates target v14. No risk of bleeding-edge breakage during a timed hackathon.

### 2.2 UI Component Library

| Technology | Version | Purpose |
|---|---|---|
| **shadcn/ui** | `latest` (CLI-installed) | Pre-built, accessible UI primitives |
| **Radix UI** | `1.x` (auto-installed) | Headless component primitives (underpins shadcn) |
| **Lucide React** | `0.400.x` | Icon library (600+ icons, tree-shakable) |
| **class-variance-authority** | `0.7.x` | Component variant management |
| **clsx** | `2.1.x` | Conditional class merging |
| **tailwind-merge** | `2.4.x` | Intelligent Tailwind class deduplication |

**shadcn/ui Components to Install:**

```bash
# Core layout & navigation
npx shadcn-ui@latest add sidebar
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add breadcrumb

# Data display
npx shadcn-ui@latest add table
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar

# Forms & inputs
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add button
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add date-picker

# Feedback & overlays
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add sonner
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
```

### 2.3 State Management

| Approach | Use Case |
|---|---|
| **React Context** | Auth state (user, role, permissions) — global |
| **useState / useReducer** | Local component state (forms, modals, filters) |
| **Server Components** | Data fetching — no client state needed for read-only views |
| **SWR** (optional) | Client-side data fetching with caching & revalidation |

> No Redux, Zustand, or Jotai needed — the app's state complexity doesn't warrant it within 8 hours.

### 2.4 Routing (App Router)

```
app/
├── (auth)/
│   └── login/page.tsx              → Login page
├── (dashboard)/
│   ├── layout.tsx                   → Sidebar + header layout (protected)
│   ├── page.tsx                     → Dashboard (KPIs, charts, recent trips)
│   ├── vehicles/
│   │   └── page.tsx                 → Vehicle Registry (list + CRUD modals)
│   ├── drivers/
│   │   └── page.tsx                 → Driver Management (list + CRUD modals)
│   ├── trips/
│   │   └── page.tsx                 → Trip Dispatcher (list + map + forms)
│   ├── maintenance/
│   │   └── page.tsx                 → Maintenance logs
│   ├── fuel-expenses/
│   │   └── page.tsx                 → Fuel logs + expenses (tabbed)
│   ├── reports/
│   │   └── page.tsx                 → Reports & Analytics (charts + export)
│   └── settings/
│       └── page.tsx                 → Settings + RBAC matrix
└── api/                             → API Route Handlers
```

---

## 3. Backend Layer

### 3.1 API Framework

| Technology | Version | Purpose |
|---|---|---|
| **Next.js Route Handlers** | `14.2.x` | REST API endpoints (app/api/) |
| **Zod** | `3.23.x` | Request body validation & type inference |

**API Route Structure:**

```
app/api/
├── auth/
│   ├── login/route.ts               → POST /api/auth/login
│   ├── logout/route.ts              → POST /api/auth/logout
│   └── me/route.ts                  → GET  /api/auth/me
├── vehicles/
│   ├── route.ts                     → GET (list), POST (create)
│   ├── [id]/route.ts                → GET, PUT, PATCH
│   └── available/route.ts           → GET (dispatch-eligible)
├── drivers/
│   ├── route.ts                     → GET (list), POST (create)
│   ├── [id]/route.ts                → GET, PUT
│   ├── [id]/suspend/route.ts        → PATCH
│   ├── [id]/reinstate/route.ts      → PATCH
│   └── eligible/route.ts            → GET (dispatch-eligible)
├── trips/
│   ├── route.ts                     → GET (list), POST (create draft)
│   ├── [id]/route.ts                → GET
│   ├── [id]/dispatch/route.ts       → POST
│   ├── [id]/complete/route.ts       → POST
│   └── [id]/cancel/route.ts         → POST
├── maintenance/
│   ├── route.ts                     → GET (list), POST (create)
│   └── [id]/close/route.ts          → PATCH
├── fuel-logs/
│   ├── route.ts                     → GET (list), POST (create)
│   └── [id]/approve/route.ts        → PATCH
├── expenses/
│   ├── route.ts                     → GET (list), POST (create)
│   └── [id]/approve/route.ts        → PATCH
└── reports/
    ├── dashboard/route.ts           → GET (KPI data)
    ├── fuel-efficiency/route.ts     → GET
    ├── operational-cost/route.ts    → GET
    ├── vehicle-roi/route.ts         → GET
    └── export/csv/route.ts          → GET (CSV download)
```

### 3.2 Middleware

| Middleware | File | Purpose |
|---|---|---|
| **Auth Guard** | `middleware.ts` | Redirect unauthenticated users to `/login` |
| **RBAC Check** | `lib/rbac.ts` | Per-route role validation, returns 403 if unauthorized |
| **Request Logger** | `lib/logger.ts` | Dev-mode API request/response logging |

### 3.3 Business Logic Services

| Service File | PRD Module | Key Functions |
|---|---|---|
| `lib/services/vehicle.service.ts` | §5.3 Vehicle Registry | `createVehicle()`, `updateVehicle()`, `retireVehicle()`, `getAvailable()` |
| `lib/services/driver.service.ts` | §5.4 Driver Management | `createDriver()`, `suspendDriver()`, `reinstateDriver()`, `getEligible()` |
| `lib/services/trip.service.ts` | §5.5 Trip Dispatcher | `createTrip()`, `dispatchTrip()`, `completeTrip()`, `cancelTrip()` |
| `lib/services/maintenance.service.ts` | §5.6 Maintenance | `createRecord()`, `closeRecord()` |
| `lib/services/fuel.service.ts` | §5.7 Fuel & Expenses | `logFuel()`, `logExpense()`, `approve()`, `reject()` |
| `lib/services/report.service.ts` | §5.8 Reports | `getDashboardKPIs()`, `getFuelEfficiency()`, `getOperationalCost()`, `getVehicleROI()` |

---

## 4. Database Layer

### 4.1 Database Engine

| Technology | Version | Purpose |
|---|---|---|
| **PostgreSQL** | `16.x` | Primary production database |
| **SQLite** | `3.x` (fallback) | Zero-config local development alternative |

**Why PostgreSQL over SQLite for hackathon?**
- Native transaction support (critical for BR-08 through BR-15 atomic state transitions)
- JSON column type for `permissions` and `safety_events`
- Better concurrent write handling (10 simultaneous users requirement)
- Matches Odoo ecosystem if judges ask about production readiness

**Quick Setup with Docker:**

```bash
docker run --name transitops-db -e POSTGRES_DB=transitops -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=transit123 -p 5432:5432 -d postgres:16-alpine
```

**Fallback for no-Docker environments:**

```
# In .env, simply switch the provider
DATABASE_URL="file:./dev.db"   # SQLite
```

### 4.2 ORM

| Technology | Version | Purpose |
|---|---|---|
| **Prisma** | `5.17.x` | Type-safe ORM, migrations, seed scripts |
| **@prisma/client** | `5.17.x` | Auto-generated query client |

**Prisma Schema Preview** (`prisma/schema.prisma`):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"   // or "sqlite" for fallback
  url      = env("DATABASE_URL")
}

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String    @map("password_hash")
  fullName     String    @map("full_name")
  roleId       Int       @map("role_id")
  role         Role      @relation(fields: [roleId], references: [id])
  createdAt    DateTime  @default(now()) @map("created_at")
  lastLogin    DateTime? @map("last_login")
  isActive     Boolean   @default(true) @map("is_active")
  trips        Trip[]    @relation("CreatedBy")

  @@map("users")
}

model Role {
  id          Int    @id @default(autoincrement())
  name        String @unique
  permissions Json
  users       User[]

  @@map("roles")
}

model Vehicle {
  id                 Int              @id @default(autoincrement())
  registrationNumber String           @unique @map("registration_number")
  nameModel          String           @map("name_model")
  type               String
  maxLoadCapacity    Float            @map("max_load_capacity")
  odometer           Float            @default(0)
  acquisitionCost    Float            @default(0) @map("acquisition_cost")
  status             String           @default("Available")
  region             String?
  createdAt          DateTime         @default(now()) @map("created_at")
  updatedAt          DateTime         @updatedAt @map("updated_at")
  trips              Trip[]
  maintenanceLogs    MaintenanceLog[]
  fuelLogs           FuelLog[]
  expenses           Expense[]

  @@index([status])
  @@map("vehicles")
}

model Driver {
  id              Int      @id @default(autoincrement())
  name            String
  licenseNumber   String   @unique @map("license_number")
  licenseCategory String   @map("license_category")
  licenseExpiry   DateTime @map("license_expiry")
  contactNumber   String   @map("contact_number")
  safetyScore     Float    @default(100) @map("safety_score")
  status          String   @default("Available")
  safetyEvents    Json?    @map("safety_events")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  trips           Trip[]

  @@index([status, licenseExpiry])
  @@map("drivers")
}

model Trip {
  id              Int       @id @default(autoincrement())
  tripCode        String    @unique @map("trip_code")
  vehicleId       Int       @map("vehicle_id")
  vehicle         Vehicle   @relation(fields: [vehicleId], references: [id])
  driverId        Int       @map("driver_id")
  driver          Driver    @relation(fields: [driverId], references: [id])
  createdById     Int       @map("created_by")
  createdBy       User      @relation("CreatedBy", fields: [createdById], references: [id])
  source          String
  destination     String
  cargoWeight     Float     @map("cargo_weight")
  plannedDistance  Float     @map("planned_distance")
  actualDistance   Float?    @map("actual_distance")
  fuelConsumed    Float?    @map("fuel_consumed")
  startOdometer   Float?    @map("start_odometer")
  endOdometer     Float?    @map("end_odometer")
  status          String    @default("Draft")
  revenue         Float?
  dispatchedAt    DateTime? @map("dispatched_at")
  completedAt     DateTime? @map("completed_at")
  cancelledAt     DateTime? @map("cancelled_at")
  createdAt       DateTime  @default(now()) @map("created_at")

  @@index([status])
  @@index([vehicleId, driverId])
  @@map("trips")
}

model MaintenanceLog {
  id          Int       @id @default(autoincrement())
  recordCode  String    @unique @map("record_code")
  vehicleId   Int       @map("vehicle_id")
  vehicle     Vehicle   @relation(fields: [vehicleId], references: [id])
  serviceType String    @map("service_type")
  description String?
  cost        Float
  status      String    @default("Active")
  createdAt   DateTime  @default(now()) @map("created_at")
  closedAt    DateTime? @map("closed_at")

  @@index([vehicleId, status])
  @@map("maintenance_logs")
}

model FuelLog {
  id             Int       @id @default(autoincrement())
  logCode        String    @unique @map("log_code")
  vehicleId      Int       @map("vehicle_id")
  vehicle        Vehicle   @relation(fields: [vehicleId], references: [id])
  logDate        DateTime  @map("log_date")
  liters         Float
  costPerLiter   Float     @map("cost_per_liter")
  totalCost      Float     @map("total_cost")
  odometerAtFill Float?    @map("odometer_at_fill")
  receiptUrl     String?   @map("receipt_url")
  approvalStatus String    @default("Pending") @map("approval_status")
  approvedById   Int?      @map("approved_by")
  createdAt      DateTime  @default(now()) @map("created_at")

  @@index([vehicleId, logDate])
  @@map("fuel_logs")
}

model Expense {
  id             Int       @id @default(autoincrement())
  expenseCode    String    @unique @map("expense_code")
  tripId         Int?      @map("trip_id")
  vehicleId      Int       @map("vehicle_id")
  vehicle        Vehicle   @relation(fields: [vehicleId], references: [id])
  category       String
  amount         Float
  expenseDate    DateTime  @map("expense_date")
  description    String?
  receiptUrl     String?   @map("receipt_url")
  approvalStatus String    @default("Pending") @map("approval_status")
  approvedById   Int?      @map("approved_by")
  createdAt      DateTime  @default(now()) @map("created_at")

  @@map("expenses")
}
```

### 4.3 Database Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Reset database (development only)
npx prisma migrate reset
```

---

## 5. Authentication & Authorization

### 5.1 Auth Package

| Technology | Version | Purpose |
|---|---|---|
| **NextAuth.js** | `4.24.x` | Session management, JWT, credentials provider |
| **bcryptjs** | `2.4.x` | Password hashing (bcrypt, 12 salt rounds) |
| **jose** | `5.6.x` | JWT signing/verification (lightweight alternative to jsonwebtoken) |

### 5.2 Auth Flow

```mermaid
sequenceDiagram
    participant Browser
    participant NextAuth
    participant API
    participant DB

    Browser->>NextAuth: POST /api/auth/login {email, password}
    NextAuth->>DB: Find user by email
    DB-->>NextAuth: User record + hashed password
    NextAuth->>NextAuth: bcrypt.compare(password, hash)
    alt Valid credentials
        NextAuth->>NextAuth: Generate JWT (user.id, role, permissions)
        NextAuth-->>Browser: Set httpOnly cookie + return session
        Browser->>API: GET /api/vehicles (cookie attached)
        API->>API: Verify JWT, check RBAC
        API-->>Browser: 200 + data
    else Invalid credentials
        NextAuth-->>Browser: 401 Unauthorized
    end
```

### 5.3 RBAC Implementation

```typescript
// lib/rbac.ts — Permission checking utility
type Permission = 'full' | 'view' | 'none';
type Module = 'dashboard' | 'fleet' | 'drivers' | 'trips' | 'maintenance' | 'fuel' | 'reports' | 'settings';

const ROLE_PERMISSIONS: Record<string, Record<Module, Permission>> = {
  'Fleet Manager':     { dashboard: 'full', fleet: 'full', drivers: 'view', trips: 'view', maintenance: 'full', fuel: 'view', reports: 'full', settings: 'full' },
  'Dispatcher':        { dashboard: 'full', fleet: 'view', drivers: 'view', trips: 'full', maintenance: 'none', fuel: 'none', reports: 'view', settings: 'none' },
  'Safety Officer':    { dashboard: 'view', fleet: 'none', drivers: 'full', trips: 'view', maintenance: 'none', fuel: 'full', reports: 'view', settings: 'none' },
  'Financial Analyst': { dashboard: 'view', fleet: 'view', drivers: 'none', trips: 'view', maintenance: 'view', fuel: 'full', reports: 'full', settings: 'none' },
};
```

### 5.4 Session Configuration

| Setting | Value | PRD Reference |
|---|---|---|
| JWT Strategy | `jwt` (not database sessions) | §5.1.1 — JWT-based auth |
| Access Token TTL | 1 hour | §5.1.1 — Access token TTL |
| Session Max Age | 7 days (with Remember Me) | §5.1.1 — Refresh token TTL |
| Cookie | `httpOnly`, `secure`, `sameSite: lax` | §5.1.1 — httpOnly cookies |
| Failed Attempts Lock | 5 attempts → lockout | §5.1.1 — Account lockout |

---

## 6. Data Visualization & Charts

### 6.1 Chart Library

| Technology | Version | Purpose |
|---|---|---|
| **Recharts** | `2.12.x` | React-native charting library |

**Why Recharts over Chart.js?**
- Built with React components (declarative, composable)
- TypeScript support out-of-box
- Responsive containers by default
- Smaller bundle than Chart.js + react-chartjs-2 wrapper

### 6.2 Chart Usage Map (PRD → Chart Type)

| PRD Section | Chart Component | Recharts Type | Data Shape |
|---|---|---|---|
| §5.2.3 Vehicle Status Chart | `<PieChart>` / `<DonutChart>` | `PieChart` + inner radius | `[{ name: 'Available', value: 8 }, ...]` |
| §5.8.2 Monthly Revenue Trend | `<BarChart>` | `BarChart` (vertical) | `[{ month: 'Jan', revenue: 45000 }, ...]` |
| §5.8.2 Top Costliest Vehicles | `<BarChart>` | `BarChart` (horizontal, `layout="vertical"`) | `[{ vehicle: 'TRK-01', cost: 32000 }, ...]` |
| §5.8.2 Fuel Efficiency by Vehicle | `<LineChart>` | `LineChart` + `<Line>` | `[{ date: '2026-01', efficiency: 12.5 }, ...]` |
| §5.8.2 Trip Status Distribution | `<PieChart>` | `PieChart` (donut) | `[{ status: 'Completed', count: 42 }, ...]` |
| §5.8.2 Driver Safety Scores | `<BarChart>` | `BarChart` (horizontal) | `[{ driver: 'Alex', score: 92 }, ...]` |
| §5.8.1 Fleet Utilization | Circular Progress | Custom SVG or `<RadialBarChart>` | `[{ utilization: 73 }]` |

### 6.3 Chart Color Palette

```typescript
// lib/chart-colors.ts
export const CHART_COLORS = {
  available: '#22C55E',    // Green-500
  onTrip:    '#3B82F6',    // Blue-500
  inShop:    '#F97316',    // Orange-500
  retired:   '#6B7280',    // Gray-500
  draft:     '#9CA3AF',    // Gray-400
  completed: '#10B981',    // Emerald-500
  cancelled: '#EF4444',    // Red-500
  primary:   '#6366F1',    // Indigo-500
  secondary: '#8B5CF6',    // Violet-500
  accent:    '#06B6D4',    // Cyan-500
};
```

---

## 7. File Handling & Exports

### 7.1 CSV Export

| Technology | Version | Purpose |
|---|---|---|
| **json2csv** | `6.x` (@json2csv/plainjs) | Convert JSON arrays to CSV strings |

**Implementation Pattern:**

```typescript
// app/api/reports/export/csv/route.ts
import { Parser } from '@json2csv/plainjs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const module = searchParams.get('module');
  
  const data = await fetchModuleData(module);
  const parser = new Parser({ fields: getFieldsForModule(module) });
  const csv = parser.parse(data);
  
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="transitops_${module}_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
```

### 7.2 PDF Export (Bonus Feature)

| Technology | Version | Purpose |
|---|---|---|
| **@react-pdf/renderer** | `3.4.x` | React-based PDF generation (server or client) |
| **html2pdf.js** | `0.10.x` | Alternative: HTML-to-PDF (client-side, simpler) |

> 💡 **Hackathon tip**: Use `html2pdf.js` for quick wins — it screenshots the current DOM view. Use `@react-pdf/renderer` only if you need custom-formatted reports.

### 7.3 File Uploads (Receipts)

| Technology | Version | Purpose |
|---|---|---|
| **Next.js built-in** | `14.x` | `formData` parsing in Route Handlers |
| **Local filesystem** | — | Store in `public/uploads/` for hackathon |

**Upload Endpoint Pattern:**

```typescript
// app/api/upload/route.ts
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  await writeFile(`public/uploads/${filename}`, buffer);
  return Response.json({ url: `/uploads/${filename}` });
}
```

---

## 8. Validation & Type Safety

### 8.1 Runtime Validation

| Technology | Version | Purpose |
|---|---|---|
| **Zod** | `3.23.x` | Schema validation for API inputs |

**Validation Schema Examples:**

```typescript
// lib/validations/vehicle.schema.ts
import { z } from 'zod';

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1).max(15).regex(/^[A-Z0-9-]+$/i, 'Alphanumeric and dashes only'),
  nameModel:          z.string().min(1).max(50),
  type:               z.enum(['Van', 'Truck', 'Mini', 'Bus', 'Sedan']),
  maxLoadCapacity:    z.number().positive().max(50000),
  odometer:           z.number().nonnegative().optional().default(0),
  acquisitionCost:    z.number().nonnegative().optional().default(0),
  region:             z.string().optional(),
});

// lib/validations/trip.schema.ts
export const dispatchTripSchema = z.object({
  source:          z.string().min(1),
  destination:     z.string().min(1),
  vehicleId:       z.number().int().positive(),
  driverId:        z.number().int().positive(),
  cargoWeight:     z.number().positive(),
  plannedDistance:  z.number().positive(),
});
```

### 8.2 Type Safety

| Technology | Purpose |
|---|---|
| **TypeScript** | Compile-time type checking |
| **Prisma Generated Types** | Auto-generated DB model types |
| **Zod Infer** | `z.infer<typeof schema>` for form/API types |

---

## 9. Styling & Design System

### 9.1 Core Styling

| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | `3.4.x` | Utility-first CSS framework |
| **tailwindcss-animate** | `1.0.x` | Animation utilities for shadcn |
| **@tailwindcss/typography** | `0.5.x` | Prose styling (if needed for reports) |

### 9.2 Design Tokens

```css
/* app/globals.css — CSS Variables (Light + Dark Mode) */
:root {
  /* Brand Colors */
  --primary:     238 84% 67%;     /* Indigo */
  --secondary:   258 90% 66%;     /* Violet */
  --accent:      192 91% 36%;     /* Cyan */

  /* Status Colors */
  --available:   142 71% 45%;     /* Green */
  --on-trip:     217 91% 60%;     /* Blue */
  --in-shop:     25 95% 53%;      /* Orange */
  --retired:     220 9% 46%;      /* Gray */

  /* Badge Colors */
  --draft:       220 13% 69%;
  --dispatched:  217 91% 60%;
  --completed:   160 84% 39%;
  --cancelled:   0 84% 60%;
  --suspended:   0 84% 60%;

  /* Glassmorphism */
  --glass-bg:    rgba(255, 255, 255, 0.7);
  --glass-blur:  12px;
  --glass-border: rgba(255, 255, 255, 0.2);
}

.dark {
  --glass-bg:    rgba(30, 30, 40, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

### 9.3 Typography

| Font | Weight | Usage | Source |
|---|---|---|---|
| **Inter** | 400, 500, 600, 700 | Body text, labels, inputs | Google Fonts (next/font) |
| **Outfit** | 600, 700, 800 | Headings, KPI numbers | Google Fonts (next/font) |

```typescript
// app/layout.tsx
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
```

### 9.4 Responsive Breakpoints (Tailwind)

| Breakpoint | Width | PRD Reference |
|---|---|---|
| `sm` | 640px | — |
| `md` | 768px | Tablet (sidebar collapses) |
| `lg` | 1024px | Desktop (sidebar fixed) |
| `xl` | 1280px | — |
| `2xl` | 1440px | Wide desktop |

### 9.5 Dark Mode Strategy

```typescript
// Tailwind config — class-based dark mode
module.exports = {
  darkMode: 'class',
  // ...
};

// Toggle implementation: localStorage + system preference
// Uses 'class' strategy so shadcn components auto-adapt
```

---

## 10. Development Tools

### 10.1 Dev Dependencies

| Technology | Version | Purpose |
|---|---|---|
| **ESLint** | `8.x` | Code linting (Next.js config) |
| **Prettier** | `3.3.x` | Code formatting |
| **Prisma Studio** | (built-in) | Visual database browser at localhost:5555 |
| **TypeScript** | `5.5.x` | Static analysis |

### 10.2 Scripts (`package.json`)

```json
{
  "scripts": {
    "dev":           "next dev",
    "build":         "next build",
    "start":         "next start",
    "lint":          "next lint",
    "db:generate":   "prisma generate",
    "db:migrate":    "prisma migrate dev",
    "db:seed":       "prisma db seed",
    "db:studio":     "prisma studio",
    "db:reset":      "prisma migrate reset",
    "format":        "prettier --write ."
  }
}
```

### 10.3 Git Hooks (Optional but recommended)

| Tool | Purpose |
|---|---|
| **husky** | Git hooks manager |
| **lint-staged** | Run ESLint/Prettier on staged files only |

---

## 11. Project Structure

```
transitops/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                 ← Sidebar + Header + RBAC guard
│   │   ├── page.tsx                   ← Dashboard
│   │   ├── vehicles/page.tsx
│   │   ├── drivers/page.tsx
│   │   ├── trips/page.tsx
│   │   ├── maintenance/page.tsx
│   │   ├── fuel-expenses/page.tsx
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/...
│   │   ├── vehicles/...
│   │   ├── drivers/...
│   │   ├── trips/...
│   │   ├── maintenance/...
│   │   ├── fuel-logs/...
│   │   ├── expenses/...
│   │   └── reports/...
│   ├── globals.css
│   └── layout.tsx                     ← Root layout (fonts, metadata)
├── components/
│   ├── ui/                            ← shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── sidebar.tsx                ← Navigation sidebar
│   │   ├── header.tsx                 ← Top bar with breadcrumbs
│   │   └── mobile-nav.tsx             ← Hamburger menu
│   ├── dashboard/
│   │   ├── kpi-card.tsx               ← Metric card with count-up
│   │   ├── recent-trips-table.tsx
│   │   └── vehicle-status-chart.tsx
│   ├── vehicles/
│   │   ├── vehicle-table.tsx
│   │   └── vehicle-form-modal.tsx
│   ├── drivers/
│   │   ├── driver-table.tsx
│   │   ├── driver-form-modal.tsx
│   │   └── compliance-badge.tsx
│   ├── trips/
│   │   ├── trip-table.tsx
│   │   ├── trip-form.tsx
│   │   └── trip-completion-modal.tsx
│   ├── maintenance/
│   │   ├── maintenance-table.tsx
│   │   └── maintenance-form-modal.tsx
│   ├── fuel-expenses/
│   │   ├── fuel-log-table.tsx
│   │   ├── expense-table.tsx
│   │   ├── fuel-form-modal.tsx
│   │   └── expense-form-modal.tsx
│   ├── reports/
│   │   ├── kpi-summary.tsx
│   │   ├── revenue-chart.tsx
│   │   ├── cost-chart.tsx
│   │   ├── efficiency-chart.tsx
│   │   └── export-button.tsx
│   └── shared/
│       ├── status-badge.tsx           ← Reusable colored status badges
│       ├── data-table.tsx             ← Generic sortable/filterable table
│       ├── search-input.tsx
│       ├── date-range-picker.tsx
│       └── confirm-dialog.tsx
├── lib/
│   ├── prisma.ts                      ← Singleton Prisma client
│   ├── auth.ts                        ← NextAuth config
│   ├── rbac.ts                        ← Permission matrix + checker
│   ├── utils.ts                       ← cn() helper, formatters
│   ├── chart-colors.ts
│   ├── constants.ts                   ← Enums, status values
│   ├── validations/
│   │   ├── vehicle.schema.ts
│   │   ├── driver.schema.ts
│   │   ├── trip.schema.ts
│   │   ├── maintenance.schema.ts
│   │   ├── fuel.schema.ts
│   │   └── expense.schema.ts
│   └── services/
│       ├── vehicle.service.ts
│       ├── driver.service.ts
│       ├── trip.service.ts
│       ├── maintenance.service.ts
│       ├── fuel.service.ts
│       └── report.service.ts
├── prisma/
│   ├── schema.prisma                  ← Database schema
│   ├── migrations/                    ← Auto-generated migrations
│   └── seed.ts                        ← Demo data seeder
├── public/
│   ├── uploads/                       ← Receipt file uploads
│   └── logo.svg
├── middleware.ts                       ← Auth redirect middleware
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── components.json                    ← shadcn/ui config
├── package.json
├── .env                               ← Environment variables (local)
├── .env.example                       ← Template for env vars
├── PRD.md
├── TechStack.md
└── README.md
```

---

## 12. Environment Variables

```bash
# .env.example

# ─── Database ───────────────────────────────────────
DATABASE_URL="postgresql://admin:transit123@localhost:5432/transitops"
# For SQLite fallback: DATABASE_URL="file:./dev.db"

# ─── NextAuth ───────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"

# ─── App Configuration ──────────────────────────────
NEXT_PUBLIC_APP_NAME="TransitOps"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ─── File Uploads ───────────────────────────────────
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE="5242880"   # 5MB in bytes

# ─── Email (Bonus: License Expiry Reminders) ────────
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="transitops@gmail.com"
# SMTP_PASS="app-specific-password"
```

---

## 13. Dependency Manifest

### 13.1 Production Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prisma/client": "^5.17.0",
    "next-auth": "^4.24.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.23.0",
    "recharts": "^2.12.0",
    "@json2csv/plainjs": "^7.0.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.4.0",
    "lucide-react": "^0.400.0",
    "sonner": "^1.5.0",
    "date-fns": "^3.6.0"
  }
}
```

### 13.2 Dev Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.14.0",
    "prisma": "^5.17.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "tailwindcss-animate": "^1.0.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.3.0",
    "tsx": "^4.16.0"
  }
}
```

### 13.3 Install Command (One-Shot)

```bash
# Initialize Next.js project
npx -y create-next-app@14 ./ --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm

# Install production deps
npm install @prisma/client next-auth bcryptjs zod recharts @json2csv/plainjs class-variance-authority clsx tailwind-merge lucide-react sonner date-fns

# Install dev deps
npm install -D prisma @types/bcryptjs tailwindcss-animate tsx

# Initialize Prisma
npx prisma init

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

---

## 14. PRD → Package Traceability Matrix

Every PRD requirement maps to a specific technology:

| PRD Section | Requirement | Package(s) |
|---|---|---|
| §5.1 Authentication | JWT login, session management | `next-auth`, `bcryptjs` |
| §5.1 RBAC | Role-based access control | `lib/rbac.ts` (custom), `next-auth` |
| §5.2 Dashboard KPIs | 7 metric cards with count-up | `react`, shadcn `Card` |
| §5.2 Vehicle Status Chart | Donut/Pie chart | `recharts` (`PieChart`) |
| §5.2 Recent Trips Table | Sortable, filterable data table | shadcn `Table`, `DataTable` |
| §5.3 Vehicle Registry | CRUD forms, unique reg validation | shadcn `Dialog`, `Input`, `Select`, `zod` |
| §5.4 Driver Management | License expiry badges, safety scores | shadcn `Badge`, `date-fns` |
| §5.5 Trip Dispatcher | Create/dispatch/complete/cancel + validations | `zod`, `@prisma/client` (transactions) |
| §5.5 Trip Map | Interactive map view | (Optional) Leaflet.js or static placeholder |
| §5.6 Maintenance | Create/close records, auto status | `@prisma/client` (transactions) |
| §5.7 Fuel Logs | Log fuel, receipt upload, approval | Next.js file upload, shadcn `Tabs` |
| §5.7 Expenses | Log expenses, categorize, approve | shadcn `Select`, `Badge` |
| §5.8 Reports Charts | 5 chart types | `recharts` |
| §5.8 CSV Export | Download filtered data as CSV | `@json2csv/plainjs` |
| §5.8 PDF Export (Bonus) | Formatted PDF reports | `@react-pdf/renderer` or `html2pdf.js` |
| §5.9 Settings | RBAC matrix editor | shadcn `Table`, `Select` |
| §6 Database | 8 entities, indexes, transactions | `@prisma/client`, PostgreSQL |
| §7 Business Rules | 15 enforced rules | `zod` (validation) + Prisma (transactions) |
| §9 REST API | 40+ endpoints | Next.js Route Handlers |
| §11 Responsive Design | 3 breakpoints | `tailwindcss` |
| §11 Dark Mode | Class-based toggle | `tailwindcss` (darkMode: 'class') |
| §13 Email Reminders (Bonus) | License expiry alerts | `nodemailer` (install if needed) |

---

## 15. Deployment Strategy

### 15.1 Hackathon Demo (Local)

```bash
# Terminal 1: Start database (if using PostgreSQL)
docker run --name transitops-db -e POSTGRES_DB=transitops -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=transit123 -p 5432:5432 -d postgres:16-alpine

# Terminal 2: Start app
npm run db:migrate
npm run db:seed
npm run dev
# → Open http://localhost:3000
```

### 15.2 Quick Cloud Deploy (If Needed)

| Platform | Setup Time | Free Tier | Notes |
|---|---|---|---|
| **Vercel** | 2 min | ✅ Yes | Native Next.js support, automatic deploys |
| **Railway** | 5 min | ✅ Yes | PostgreSQL + Next.js in one place |
| **Render** | 5 min | ✅ Yes | Free PostgreSQL, auto-deploy from Git |

**Vercel Deploy (fastest):**

```bash
npx -y vercel --prod
```

> For PostgreSQL on Vercel, use **Vercel Postgres** (built-in) or **Neon** (free tier).

---

## 16. Performance & Optimization

### 16.1 Next.js Optimizations

| Technique | Implementation |
|---|---|
| **Server Components** | All data-fetching pages are Server Components (no client JS) |
| **Dynamic Imports** | `next/dynamic` for Recharts (heavy charting library) |
| **Image Optimization** | `next/image` for logos and icons |
| **Font Optimization** | `next/font` for Inter + Outfit (self-hosted, no FOUT) |
| **Metadata API** | `generateMetadata()` for SEO on every page |

### 16.2 Database Query Optimization

| Technique | Implementation |
|---|---|
| **Selective Fields** | `prisma.vehicle.findMany({ select: { ... } })` — no `SELECT *` |
| **Pagination** | `skip` + `take` on all list endpoints |
| **Eager Loading** | `include` for related data only when needed |
| **Indexed Queries** | All filters use indexed columns (see §6.2 in PRD) |

### 16.3 Bundle Size Control

| Package | Estimated Size | Mitigation |
|---|---|---|
| `recharts` | ~180KB gzip | Dynamic import, load only on dashboard/reports |
| `date-fns` | Tree-shakable | Import individual functions: `import { format } from 'date-fns'` |
| `@radix-ui/*` | ~5-10KB each | Tree-shakable, only installed components included |
| `zod` | ~13KB gzip | Server-side only (no client bundle impact) |

---

> 🏁 **This tech stack is optimized for the 8-hour Odoo Hackathon sprint.** Every package was chosen to maximize development speed while meeting all 15 mandatory business rules, RBAC requirements, and the full CRUD lifecycle specified in the PRD.
