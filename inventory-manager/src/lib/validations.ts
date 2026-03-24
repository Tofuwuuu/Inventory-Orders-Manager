import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(10),
  supplierId: z.coerce.number().int().positive(),
});

export const ProductPatchSchema = ProductSchema.partial();

export const OrderItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const OrderSchema = z.object({
  notes: z.string().optional(),
  items: z.array(OrderItemSchema).min(1),
});

export const SupplierSchema = z.object({
  name: z.string().min(1),
  contactEmail: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const SupplierPatchSchema = SupplierSchema.partial();
