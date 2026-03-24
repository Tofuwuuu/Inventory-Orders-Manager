import { LowStockAlert } from "@/components/LowStockAlert";
import { StatsCard } from "@/components/StatsCard";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const totalProducts = await prisma.product.count({ where: { deletedAt: null } });
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
  const lowStockProducts = await prisma.product.findMany({
    where: { deletedAt: null, quantity: { lte: 10 } },
    include: { supplier: true },
    orderBy: { quantity: "asc" },
  });

  return (
    <div className="space-y-4">
      <LowStockAlert count={lowStockProducts.length} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Products" value={totalProducts} />
        <StatsCard title="Total Orders" value={totalOrders} />
        <StatsCard title="Pending Orders" value={pendingOrders} />
      </div>
    </div>
  );
}
