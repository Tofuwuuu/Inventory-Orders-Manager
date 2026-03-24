import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SupplierSchema } from "@/lib/validations";

export async function GET() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(suppliers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = SupplierSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const supplier = await prisma.supplier.create({ data: parsed.data });
  return NextResponse.json(supplier, { status: 201 });
}
