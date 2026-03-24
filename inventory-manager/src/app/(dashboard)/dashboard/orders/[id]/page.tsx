import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { items: { include: { product: true } }, user: true },
  });
  if (!order) return notFound();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order {order.orderNumber}</h1>
        <Link className="rounded border px-3 py-2 text-sm" href={`/api/orders/${order.id}/pdf`}>Open PDF</Link>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm">Status: <OrderStatusBadge status={order.status} /></p>
        <p className="text-sm">Created by: {order.user.name}</p>
        <p className="text-sm">Total: {formatCurrency(Number(order.totalAmount))}</p>
      </div>
    </div>
  );
}
