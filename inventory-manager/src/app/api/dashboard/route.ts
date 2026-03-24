import { NextResponse } from "next/server";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalProducts, totalOrders, pendingOrders, lowStockProducts, monthly] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.findMany({
      where: { deletedAt: null, quantity: { lte: LOW_STOCK_THRESHOLD } },
      include: { supplier: true },
      orderBy: { quantity: "asc" },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: monthStart }, status: { not: "CANCELLED" } },
      _sum: { totalAmount: true },
    }),
  ]);

  return NextResponse.json({
    totalProducts,
    lowStockCount: lowStockProducts.length,
    totalOrders,
    pendingOrders,
    revenueThisMonth: Number(monthly._sum.totalAmount ?? 0),
    lowStockProducts,
  });
}
