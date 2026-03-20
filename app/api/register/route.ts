import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const bcrypt = await import("bcryptjs");
    const { name, email, password } = await req.json();
    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    return NextResponse.json({ message: "User created", id: user.id }, { status: 201 });
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
