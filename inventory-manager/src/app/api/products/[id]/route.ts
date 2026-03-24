import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductPatchSchema } from "@/lib/validations";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const product = await prisma.product.findFirst({
    where: { id: Number(params.id), deletedAt: null },
    include: { supplier: true },
  });
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = ProductPatchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });

  const updated = await prisma.product.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.user.role !== Role.ADMIN) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const deleted = await prisma.product.update({
    where: { id: Number(params.id) },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json(deleted);
}
