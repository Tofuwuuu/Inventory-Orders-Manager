import { formatCurrency } from "@/lib/utils";

export function StatsCard({ title, value, currency = false }: { title: string; value: number; currency?: boolean }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{currency ? formatCurrency(value) : value}</p>
    </div>
  );
}
