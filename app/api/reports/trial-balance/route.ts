import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ledgers = await prisma.ledger.findMany({
      include: {
        entries: true,
        group: true,
      },
    });
    const result = ledgers.map(l => ({
      ledgerName: l.ledgerName,
      groupType: l.group.groupType,
      totalDebit: l.entries.reduce((sum, e) => sum + e.debit, 0) + (l.balanceType === "Debit" ? l.openingBalance : 0),
      totalCredit: l.entries.reduce((sum, e) => sum + e.credit, 0) + (l.balanceType === "Credit" ? l.openingBalance : 0),
    }));
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
