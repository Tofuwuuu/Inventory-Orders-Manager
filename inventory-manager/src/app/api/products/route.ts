import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Number(sp.get("page") ?? 1);
  const limit = Number(sp.get("limit") ?? 10);
  const category = sp.get("category");
  const lowStock = sp.get("lowStock") === "true";
  const search = sp.get("search");
  const supplierId = sp.get("supplierId");

  const where = {
    deletedAt: null,
    ...(category ? { category } : {}),
    ...(supplierId ? { supplierId: Number(supplierId) } : {}),
    ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { sku: { contains: search, mode: "insensitive" as const } }] } : {}),
    ...(lowStock ? { quantity: { lte: LOW_STOCK_THRESHOLD } } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { supplier: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.user.role !== Role.ADMIN) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = ProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
