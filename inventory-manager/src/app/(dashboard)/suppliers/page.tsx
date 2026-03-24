"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Supplier = { id: number; name: string; contactEmail: string; phone?: string | null; address?: string | null };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  useEffect(() => {
    fetch("/api/suppliers").then((r) => r.json()).then(setSuppliers);
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Suppliers</h1>
      <div className="space-y-2">
        {suppliers.map((s) => (
          <div key={s.id} className="rounded border bg-white p-3">
            <input className="w-full rounded border px-2 py-1" value={s.name} onChange={(e) => setSuppliers((prev) => prev.map((p) => (p.id === s.id ? { ...p, name: e.target.value } : p)))} />
            <p className="mt-1 text-sm text-zinc-600">{s.contactEmail}</p>
            <Button className="mt-2" onClick={async () => {
              await fetch(`/api/suppliers/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
            }}>Save</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
