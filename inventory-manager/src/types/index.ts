import type { Order, OrderItem, Product, Supplier } from "@prisma/client";

export type ProductWithSupplier = Product & { supplier: Supplier };
export type OrderWithItems = Order & { items: (OrderItem & { product: Product })[] };

export type DashboardStats = {
  totalProducts: number;
  lowStockCount: number;
  totalOrders: number;
  pendingOrders: number;
  revenueThisMonth: number;
  lowStockProducts: ProductWithSupplier[];
};
