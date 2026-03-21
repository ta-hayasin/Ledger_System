import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Account Groups
    const groups = await prisma.accountGroup.createMany({
      data: [
        { groupName: "Cash", groupType: "Asset" },
        { groupName: "Bank", groupType: "Asset" },
        { groupName: "Debtors", groupType: "Asset" },
        { groupName: "Stock", groupType: "Asset" },
        { groupName: "Fixed Assets", groupType: "Asset" },
        { groupName: "Sales", groupType: "Income" },
        { groupName: "Other Income", groupType: "Income" },
        { groupName: "Purchase", groupType: "Expense" },
        { groupName: "Expenses", groupType: "Expense" },
        { groupName: "Capital", groupType: "Liability" },
        { groupName: "Creditors", groupType: "Liability" },
        { groupName: "Loans", groupType: "Liability" },
      ],
      skipDuplicates: true,
    });

    // Voucher Types
    await prisma.voucherType.createMany({
      data: [
        { typeName: "Payment" },
        { typeName: "Receipt" },
        { typeName: "Sales" },
        { typeName: "Purchase" },
        { typeName: "Journal" },
        { typeName: "Contra" },
      ],
      skipDuplicates: true,
    });

    // Units
    await prisma.unit.createMany({
      data: [
        { unitName: "Pieces" },
        { unitName: "Kg" },
        { unitName: "Litre" },
        { unitName: "Meter" },
      ],
      skipDuplicates: true,
    });

    // Stock Groups
    await prisma.stockGroup.createMany({
      data: [
        { groupName: "Electronics" },
        { groupName: "Furniture" },
        { groupName: "Clothing" },
        { groupName: "General" },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
