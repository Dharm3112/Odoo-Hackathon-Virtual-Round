import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getVehicleById, updateVehicle, retireVehicle } from "@/lib/services/vehicle.service";
import { updateVehicleSchema } from "@/lib/validations/vehicle.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const vehicle = await getVehicleById(parseInt(id));
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });

  return NextResponse.json(vehicle);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole !== "Fleet Manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const validated = updateVehicleSchema.parse(body);

  // Prevent status change through this endpoint
  const { status, ...updateData } = validated;

  const vehicle = await updateVehicle(parseInt(id), updateData);
  return NextResponse.json(vehicle);
}