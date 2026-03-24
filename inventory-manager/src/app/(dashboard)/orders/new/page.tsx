import { OrderForm } from "@/components/OrderForm";
import { prisma } from "@/lib/prisma";

export default async function NewOrderPage() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, price: true, quantity: true },
    orderBy: { name: "asc" },
  });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Create Order</h1>
      <OrderForm products={products.map((p) => ({ ...p, price: Number(p.price) }))} />
    </div>
  );
}
