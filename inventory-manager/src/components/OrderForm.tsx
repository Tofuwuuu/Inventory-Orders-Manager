"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { calcOrderTotal } from "@/lib/utils";
import { OrderSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";

type OrderInput = z.input<typeof OrderSchema>;

export function OrderForm({ products }: { products: { id: number; name: string; price: number; quantity: number }[] }) {
  const router = useRouter();
  const form = useForm<OrderInput>({
    resolver: zodResolver(OrderSchema),
    defaultValues: { notes: "", items: [{ productId: products[0]?.id ?? 0, quantity: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const values = form.watch("items");
  const liveTotal = calcOrderTotal(values.map((v) => ({ quantity: Number(v.quantity), unitPrice: products.find((p) => p.id === Number(v.productId))?.price ?? 0 })));

  return (
    <form
      className="space-y-3 rounded-lg border bg-white p-4"
      onSubmit={form.handleSubmit(async (data) => {
        const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (res.ok) {
          router.push("/dashboard/orders");
          router.refresh();
        }
      })}
    >
      {fields.map((field, idx) => {
        const selected = products.find((p) => p.id === Number(values[idx]?.productId));
        return (
          <div key={field.id} className="grid grid-cols-3 gap-2">
            <select className="rounded border px-2 py-2" {...form.register(`items.${idx}.productId` as const, { valueAsNumber: true })}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</option>)}
            </select>
            <input className="rounded border px-2 py-2" type="number" min={1} max={selected?.quantity ?? 1} {...form.register(`items.${idx}.quantity` as const, { valueAsNumber: true })} />
            <Button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => remove(idx)}>Remove</Button>
          </div>
        );
      })}
      <Button type="button" onClick={() => append({ productId: products[0]?.id ?? 0, quantity: 1 })}>Add Item</Button>
      <textarea className="w-full rounded border p-2" placeholder="Notes" {...form.register("notes")} />
      <div className="text-sm font-semibold">Total: ${liveTotal.toFixed(2)}</div>
      <Button type="submit">Create Order</Button>
    </form>
  );
}
