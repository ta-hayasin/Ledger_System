import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ledgers = await prisma.ledger.findMany({
      include: { group: true },
    });
    return NextResponse.json(ledgers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const existing = await prisma.ledger.findFirst({
      where: { ledgerName: body.ledgerName, companyId: body.companyId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A ledger with this name already exists!" },
        { status: 400 }
      );
    }
    const ledger = await prisma.ledger.create({
      data: body,
      include: { group: true },
    });
    return NextResponse.json(ledger, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
