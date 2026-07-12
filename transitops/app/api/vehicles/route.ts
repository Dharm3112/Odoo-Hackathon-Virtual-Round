/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllVehicles, createVehicle, checkRegistrationUnique } from "@/lib/services/vehicle.service";
import { createVehicleSchema } from "@/lib/validations/vehicle.schema";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;
  const status = searchParams.get("status") || undefined;
  const region = searchParams.get("region") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const result = await getAllVehicles({ type, status, region, search, page, limit });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole !== "Fleet Manager") {
    return NextResponse.json({ error: "Forbidden: Only Fleet Managers can create vehicles" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = createVehicleSchema.parse(body);

    const isUnique = await checkRegistrationUnique(validated.registrationNumber);
    if (!isUnique) {
      return NextResponse.json({ error: "Registration number already exists" }, { status: 409 });
    }

    const vehicle = await createVehicle({
      ...validated,
      status: "Available",
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create vehicle" }, { status: 500 });
  }
}