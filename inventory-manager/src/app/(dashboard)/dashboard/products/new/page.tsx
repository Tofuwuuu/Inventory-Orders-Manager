import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Create Product</h1>
      <ProductForm suppliers={suppliers} endpoint="/api/products" method="POST" />
    </div>
  );
}
