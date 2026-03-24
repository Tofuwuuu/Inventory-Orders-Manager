import Link from "next/link";

export function LowStockAlert({ count }: { count: number }) {
  if (!count) return null;
  return (
    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
      {count} products are low on stock. <Link href="/dashboard/products" className="underline">Review products</Link>.
    </div>
  );
}
