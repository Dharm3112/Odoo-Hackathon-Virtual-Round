/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDriverById, updateDriver } from "@/lib/services/driver.service";
import { updateDriverSchema } from "@/lib/validations/driver.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const driver = await getDriverById(parseInt(id));
  if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

  return NextResponse.json(driver);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole !== "Safety Officer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const validated = updateDriverSchema.parse(body);

  const updateData = {
    ...validated,
    licenseExpiry: validated.licenseExpiry ? new Date(validated.licenseExpiry) : undefined,
  };

  const driver = await updateDriver(parseInt(id), updateData);
  return NextResponse.json(driver);
}