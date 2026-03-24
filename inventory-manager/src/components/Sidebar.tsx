"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/suppliers", label: "Suppliers" },
  { href: "/dashboard/reports", label: "Reports" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="mb-6 text-lg font-semibold">Inventory Manager</h2>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded px-3 py-2 text-sm",
              pathname === link.href ? "bg-zinc-900 text-white" : "hover:bg-zinc-100",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
