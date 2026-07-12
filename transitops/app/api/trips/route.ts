/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTrip, getAllTrips } from "@/lib/services/trip.service";
import { createTripSchema } from "@/lib/validations/trip.schema";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const vehicleId = searchParams.get("vehicleId") ? Number(searchParams.get("vehicleId")) : undefined;
  const driverId = searchParams.get("driverId") ? Number(searchParams.get("driverId")) : undefined;
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "20");

  return NextResponse.json(await getAllTrips({ status, vehicleId, driverId, page, limit }));
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole !== "Dispatcher" && userRole !== "Fleet Manager") {
    return NextResponse.json({ error: "Forbidden: Only Dispatchers or Fleet Managers can create trips" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = createTripSchema.parse(body);
    const trip = await createTrip(validated, Number((session.user as any).id));
    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create trip" }, { status: 400 });
  }
}
