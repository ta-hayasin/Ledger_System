import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ledgers = await prisma.ledger.findMany({
      include: { entries: true, group: true },
    });
    const assets = ledgers
      .filter(l => l.group.groupType === "Asset")
      .map(l => ({
        ledgerName: l.ledgerName,
        balance: l.openingBalance + l.entries.reduce((sum, e) => sum + e.debit - e.credit, 0),
      }));
    const liabilities = ledgers
      .filter(l => l.group.groupType === "Liability")
      .map(l => ({
        ledgerName: l.ledgerName,
        balance: l.openingBalance + l.entries.reduce((sum, e) => sum + e.credit - e.debit, 0),
      }));
    const totalAssets = assets.reduce((sum, r) => sum + r.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, r) => sum + r.balance, 0);
    return NextResponse.json({ assets, liabilities, totalAssets, totalLiabilities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
