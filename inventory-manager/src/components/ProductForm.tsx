"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProductSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";

type ProductInput = z.input<typeof ProductSchema>;

export function ProductForm({ suppliers, initialData, endpoint, method }: { suppliers: { id: number; name: string }[]; initialData?: Partial<ProductInput>; endpoint: string; method: "POST" | "PATCH" }) {
  const router = useRouter();
  const form = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: { lowStockThreshold: 10, quantity: 0, ...initialData },
  });

  return (
    <form
      className="grid gap-3 rounded-lg border bg-white p-4"
      onSubmit={form.handleSubmit(async (values) => {
        await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
        router.push("/dashboard/products");
        router.refresh();
      })}
    >
      <input className="rounded border px-3 py-2" placeholder="Name" {...form.register("name")} />
      <input className="rounded border px-3 py-2" placeholder="SKU" {...form.register("sku")} />
      <input className="rounded border px-3 py-2" placeholder="Category" {...form.register("category")} />
      <input className="rounded border px-3 py-2" type="number" step="0.01" placeholder="Price" {...form.register("price", { valueAsNumber: true })} />
      <input className="rounded border px-3 py-2" type="number" placeholder="Quantity" {...form.register("quantity", { valueAsNumber: true })} />
      <select className="rounded border px-3 py-2" {...form.register("supplierId", { valueAsNumber: true })}>
        {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <Button type="submit">Save Product</Button>
    </form>
  );
}
