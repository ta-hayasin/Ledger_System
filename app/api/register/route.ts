import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const userCount = await prisma.user.count();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });

    // If users already exist, only allow creation from admin panel (internal flag)
    if (userCount > 0 && !body.adminCreating)
      return NextResponse.json({ error: "Registration is closed. Contact your administrator." }, { status: 403 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: userCount === 0 ? "admin" : (role || "accountant"),
      },
    });
    return NextResponse.json({ message: "User created", id: user.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
