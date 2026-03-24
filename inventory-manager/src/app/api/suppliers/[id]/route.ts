import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SupplierPatchSchema } from "@/lib/validations";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const supplier = await prisma.supplier.findUnique({ where: { id: Number(params.id) } });
  if (!supplier) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(supplier);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = SupplierPatchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const supplier = await prisma.supplier.update({ where: { id: Number(params.id) }, data: parsed.data });
  return NextResponse.json(supplier);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await prisma.supplier.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
