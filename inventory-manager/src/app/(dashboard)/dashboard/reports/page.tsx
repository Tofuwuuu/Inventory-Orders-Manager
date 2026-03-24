import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function ReportsPage() {
  const [ordersCount, productsCount, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: "CANCELLED" } } }),
  ]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded border bg-white p-4"><p className="text-sm text-zinc-500">Products</p><p className="text-2xl font-semibold">{productsCount}</p></div>
        <div className="rounded border bg-white p-4"><p className="text-sm text-zinc-500">Orders</p><p className="text-2xl font-semibold">{ordersCount}</p></div>
        <div className="rounded border bg-white p-4"><p className="text-sm text-zinc-500">Revenue</p><p className="text-2xl font-semibold">{formatCurrency(Number(revenue._sum.totalAmount ?? 0))}</p></div>
      </div>
      <div className="flex gap-2">
        <button className="rounded border px-3 py-2 text-sm">Export CSV</button>
        <button className="rounded border px-3 py-2 text-sm">Export PDF</button>
      </div>
    </div>
  );
}
