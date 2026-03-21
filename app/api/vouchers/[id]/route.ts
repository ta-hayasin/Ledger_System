import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    await prisma.voucher.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Cannot delete this voucher." }, { status: 500 });
  }
}
