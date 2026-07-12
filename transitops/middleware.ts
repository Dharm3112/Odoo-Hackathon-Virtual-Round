import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;
    const permissions = token.permissions as Record<string, string>;

    const rolePermissions: Record<string, Record<string, string>> = {
      "Fleet Manager": { dashboard: "full", fleet: "full", drivers: "view", trips: "view", maintenance: "full", fuel: "view", reports: "full", settings: "full" },
      "Dispatcher": { dashboard: "full", fleet: "view", drivers: "view", trips: "full", maintenance: "none", fuel: "none", reports: "view", settings: "none" },
      "Safety Officer": { dashboard: "view", fleet: "none", drivers: "full", trips: "view", maintenance: "none", fuel: "full", reports: "view", settings: "none" },
      "Financial Analyst": { dashboard: "view", fleet: "view", drivers: "none", trips: "view", maintenance: "view", fuel: "full", reports: "full", settings: "none" },
    };

    const moduleMap: Record<string, string> = {
      "/vehicles": "fleet",
      "/drivers": "drivers",
      "/trips": "trips",
      "/maintenance": "maintenance",
      "/fuel-expenses": "fuel",
      "/reports": "reports",
      "/settings": "settings",
    };

    for (const [route, module] of Object.entries(moduleMap)) {
      if (path.startsWith(route)) {
        const permission = rolePermissions[role]?.[module] || "none";
        if (permission === "none") {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/vehicles/:path*",
    "/drivers/:path*",
    "/trips/:path*",
    "/maintenance/:path*",
    "/fuel-expenses/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/",
  ],
};