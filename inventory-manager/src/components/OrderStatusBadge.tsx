import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  FULFILLED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", tone[status] ?? "bg-zinc-100")}>{status}</span>;
}
