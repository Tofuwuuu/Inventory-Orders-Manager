import Link from "next/link";
import { ProductTable } from "@/components/ProductTable";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { supplier: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" href="/dashboard/products/new">New Product</Link>
      </div>
      <ProductTable initialProducts={products} />
    </div>
  );
}
