
# TransitOps

TransitOps is a comprehensive fleet and transit management system designed to streamline vehicle operations, driver management, and route dispatching. This project was developed as a submission for the Odoo Hackathon Virtual Round.

## Tech Stack

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS & shadcn/ui
*   **Database & ORM:** Prisma (SQLite for development)
*   **Authentication:** NextAuth.js

## Key Features

*   **Dashboard Analytics:** Centralized overview of fleet metrics and reports.
*   **Driver Management:** Tools to onboard, suspend, or reinstate eligible drivers.
*   **Vehicle Tracking:** Manage vehicle lifecycles, availability, and retirement.
*   **Trip Dispatcher:** Assign and monitor transit routes.
*   **Maintenance Hub:** Track vehicle service records and maintenance schedules.
*   **Fuel Expenses:** Monitor and log fuel consumption and costs.
*   **Role-Based Access Control (RBAC):** Secure settings and access management for different user tiers.

## Prerequisites

Ensure you have the following installed on your local machine:
*   Node.js (v18 or higher)
*   npm or yarn
*   Git

## Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone [https://github.com/Dharm3112/odoo-hackathon-virtual-round.git](https://github.com/Dharm3112/odoo-hackathon-virtual-round.git)
cd odoo-hackathon-virtual-round/transitops

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Variables

Create a `.env` file in the root of the `transitops` directory using the provided example file.

```bash
cp .env.example .env

```

Ensure the following variables are configured in your `.env` file:

* `DATABASE_URL` (Points to the local SQLite `dev.db` file)
* `NEXTAUTH_SECRET`
* `NEXTAUTH_URL`

### 4. Database Setup

Run the Prisma migrations to initialize the SQLite database and seed the initial data.

```bash
npx prisma migrate dev
npx prisma db seed

```

### 5. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

* `/app`: Contains Next.js app router pages, API routes, and layout configurations.
* `/components`: Reusable UI elements and layout components (header, sidebar).
* `/lib`: Utility functions, NextAuth configurations, validations, and Prisma client setup.
* `/prisma`: Database schema, migrations, and seed scripts.
* `/types`: TypeScript type definitions.


## License

This project is licensed under the MIT License - see the LICENSE file for details.
