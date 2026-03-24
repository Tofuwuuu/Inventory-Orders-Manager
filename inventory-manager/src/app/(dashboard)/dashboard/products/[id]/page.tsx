import { notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const [suppliers, product] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findFirst({ where: { id: Number(params.id), deletedAt: null } }),
  ]);
  if (!product) return notFound();
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <ProductForm
        suppliers={suppliers}
        endpoint={`/api/products/${product.id}`}
        method="PATCH"
        initialData={{ ...product, description: product.description ?? undefined, price: Number(product.price) }}
      />
    </div>
  );
}
