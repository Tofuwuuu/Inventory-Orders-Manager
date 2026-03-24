import bcrypt from "bcrypt";
import { PrismaClient, Role, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin123", 10);
  const staffHash = await bcrypt.hash("staff123", 10);

  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@inventory.com", passwordHash: adminHash, role: Role.ADMIN },
  });
  const staff = await prisma.user.create({
    data: { name: "Staff User", email: "staff@inventory.com", passwordHash: staffHash, role: Role.STAFF },
  });

  const suppliers = await prisma.$transaction([
    prisma.supplier.create({ data: { name: "TechSource Ltd", contactEmail: "sales@techsource.com", phone: "555-0101", address: "123 Silicon Ave" } }),
    prisma.supplier.create({ data: { name: "OfficeHub Co", contactEmail: "orders@officehub.com", phone: "555-0202", address: "45 Paper St" } }),
    prisma.supplier.create({ data: { name: "BuildRight Furnishings", contactEmail: "hello@buildright.com", phone: "555-0303", address: "88 Timber Rd" } }),
  ]);

  const categories = ["Electronics", "Office", "Furniture", "Supplies"];
  const products = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      prisma.product.create({
        data: {
          name: `Product ${i + 1}`,
          sku: `SKU-${String(i + 1).padStart(4, "0")}`,
          description: `Seed product ${i + 1}`,
          category: categories[i % categories.length],
          price: (10 + i * 3.5).toFixed(2),
          quantity: 5 + (i % 9) * 4,
          lowStockThreshold: 10,
          supplierId: suppliers[i % suppliers.length].id,
        },
      }),
    ),
  );

  for (let i = 0; i < 5; i++) {
    const selected = [products[i], products[i + 5]];
    const itemPayload = selected.map((p, idx) => ({
      productId: p.id,
      quantity: idx + 1,
      unitPrice: p.price,
    }));
    const total = itemPayload.reduce((sum, it) => sum + Number(it.unitPrice) * it.quantity, 0);

    await prisma.order.create({
      data: {
        orderNumber: `ORD-${new Date().getFullYear()}-${String(i + 1).padStart(4, "0")}`,
        status: [OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.FULFILLED, OrderStatus.CANCELLED, OrderStatus.PENDING][i],
        totalAmount: total.toFixed(2),
        notes: `Sample order ${i + 1}`,
        userId: i % 2 === 0 ? admin.id : staff.id,
        items: { create: itemPayload },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
