import Link from "next/link";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const orders = await prisma.order.findMany({
    where: searchParams.status ? { status: searchParams.status as never } : {},
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Link className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" href="/dashboard/orders/new">New Order</Link>
      </div>
      <table className="w-full rounded-lg border bg-white text-sm">
        <thead><tr className="border-b"><th className="p-3 text-left">Order #</th><th>Status</th><th>Total</th><th>Created</th></tr></thead>
        <tbody>{orders.map((o) => <tr key={o.id} className="border-b"><td className="p-3"><Link className="underline" href={`/dashboard/orders/${o.id}`}>{o.orderNumber}</Link></td><td><OrderStatusBadge status={o.status} /></td><td>{formatCurrency(Number(o.totalAmount))}</td><td>{new Date(o.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
