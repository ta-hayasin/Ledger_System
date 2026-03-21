import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const company = await prisma.company.findFirst();
    return NextResponse.json(company || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const company = await prisma.company.create({ data: body });
    return NextResponse.json(company, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const company = await prisma.company.findFirst();
    if (!company) return NextResponse.json({ error: "No company found" }, { status: 404 });
    const updated = await prisma.company.update({
      where: { id: company.id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
