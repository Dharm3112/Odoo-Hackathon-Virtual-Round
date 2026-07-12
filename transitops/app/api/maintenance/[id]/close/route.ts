/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { closeMaintenanceRecord } from "@/lib/services/maintenance.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole !== "Fleet Manager") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    return NextResponse.json(await closeMaintenanceRecord(Number(id), Boolean(body.retireVehicle)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to close maintenance record" }, { status: 400 });
  }
}
