/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMaintenanceRecord, getAllMaintenanceLogs } from "@/lib/services/maintenance.service";
import { createMaintenanceSchema } from "@/lib/validations/maintenance.schema";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ maintenanceLogs: await getAllMaintenanceLogs() });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole !== "Fleet Manager") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const validated = createMaintenanceSchema.parse(await request.json());
    return NextResponse.json(await createMaintenanceRecord(validated), { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create maintenance record" }, { status: 400 });
  }
}
