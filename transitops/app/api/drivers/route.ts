/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllDrivers, createDriver, checkLicenseUnique } from "@/lib/services/driver.service";
import { createDriverSchema } from "@/lib/validations/driver.schema";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const result = await getAllDrivers({ status, search, page, limit });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole !== "Safety Officer") {
    return NextResponse.json({ error: "Forbidden: Only Safety Officers can create drivers" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = createDriverSchema.parse(body);

    const isUnique = await checkLicenseUnique(validated.licenseNumber);
    if (!isUnique) {
      return NextResponse.json({ error: "License number already exists" }, { status: 409 });
    }

    const driver = await createDriver({
      ...validated,
      licenseExpiry: new Date(validated.licenseExpiry),
      status: "Available",
      safetyEvents: JSON.stringify([]),
    });

    return NextResponse.json(driver, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create driver" }, { status: 500 });
  }
}