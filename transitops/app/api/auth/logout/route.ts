import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    // Session will be cleared client-side by next-auth
  }
  
  return NextResponse.json({ success: true });
}