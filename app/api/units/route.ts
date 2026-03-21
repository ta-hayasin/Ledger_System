import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const units = await prisma.unit.findMany();
    return NextResponse.json(units);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
