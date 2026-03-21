import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ledgerId = parseInt(searchParams.get("ledgerId") || "0");

    const ledger = await prisma.ledger.findUnique({
      where: { id: ledgerId },
      include: {
        entries: {
          include: {
            voucher: { include: { voucherType: true } },
          },
          orderBy: { voucher: { voucherDate: "asc" } },
        },
      },
    });

    if (!ledger) return NextResponse.json({ error: "Ledger not found" }, { status: 404 });

    let runningBalance = ledger.openingBalance;
    const transactions = ledger.entries.map(e => {
      runningBalance += e.debit - e.credit;
      return {
        date: e.voucher.voucherDate,
        voucherType: e.voucher.voucherType.typeName,
        description: e.voucher.description,
        debit: e.debit,
        credit: e.credit,
        balance: runningBalance,
      };
    });

    return NextResponse.json({
      ledgerName: ledger.ledgerName,
      openingBalance: ledger.openingBalance,
      balanceType: ledger.balanceType,
      totalDebit: ledger.entries.reduce((sum, e) => sum + e.debit, 0),
      totalCredit: ledger.entries.reduce((sum, e) => sum + e.credit, 0),
      transactions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
