import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: {
        voucherType: true,
        entries: { include: { ledger: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vouchers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { companyId, voucherTypeId, voucherDate, description, debitLedgerId, creditLedgerId, amount } = await req.json();
    if (debitLedgerId === creditLedgerId)
      return NextResponse.json({ error: "Debit and Credit ledger cannot be the same!" }, { status: 400 });
    const voucher = await prisma.voucher.create({
      data: {
        companyId,
        voucherTypeId,
        voucherDate: new Date(voucherDate),
        description,
        entries: {
          create: [
            { ledgerId: debitLedgerId, debit: amount, credit: 0 },
            { ledgerId: creditLedgerId, debit: 0, credit: amount },
          ],
        },
      },
      include: {
        voucherType: true,
        entries: { include: { ledger: true } },
      },
    });
    return NextResponse.json(voucher, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
