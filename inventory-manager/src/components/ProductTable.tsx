"use client";

import { useMemo, useState } from "react";
import type { ProductWithSupplier } from "@/types";

export function ProductTable({ initialProducts }: { initialProducts: ProductWithSupplier[] }) {
  const [search, setSearch] = useState("");
  const [sortByQtyAsc, setSortByQtyAsc] = useState(true);
  const products = useMemo(() => {
    return [...initialProducts]
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (sortByQtyAsc ? a.quantity - b.quantity : b.quantity - a.quantity));
  }, [initialProducts, search, sortByQtyAsc]);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-3 flex gap-2">
        <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Search name/SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="rounded border px-3 py-2 text-sm" onClick={() => setSortByQtyAsc((v) => !v)}>Sort Qty</button>
      </div>
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b"><th>Name</th><th>SKU</th><th>Category</th><th>Supplier</th><th>Qty</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.name}</td><td>{p.sku}</td><td>{p.category}</td><td>{p.supplier.name}</td><td>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
