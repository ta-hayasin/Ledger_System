import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ledgers = await prisma.ledger.findMany({
      include: { entries: true, group: true },
    });
    const income = ledgers
      .filter(l => l.group.groupType === "Income")
      .map(l => ({
        ledgerName: l.ledgerName,
        amount: l.entries.reduce((sum, e) => sum + e.credit - e.debit, 0) + l.openingBalance,
      }));
    const expenses = ledgers
      .filter(l => l.group.groupType === "Expense")
      .map(l => ({
        ledgerName: l.ledgerName,
        amount: l.entries.reduce((sum, e) => sum + e.debit - e.credit, 0) + l.openingBalance,
      }));
    const totalIncome = income.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenses.reduce((sum, r) => sum + r.amount, 0);
    return NextResponse.json({
      income,
      expenses,
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
