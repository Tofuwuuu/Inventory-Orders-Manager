import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderSchema } from "@/lib/validations";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = OrderSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: parsed.data.items.map((i) => i.productId) }, deletedAt: null },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));
      for (const item of parsed.data.items) {
        const product = productMap.get(item.productId);
        if (!product || product.quantity < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${item.productId}`);
        }
      }

      const totalAmount = parsed.data.items.reduce((sum, item) => {
        const product = productMap.get(item.productId)!;
        return sum + Number(product.price) * item.quantity;
      }, 0);

      const order = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`,
          notes: parsed.data.notes,
          userId: session.user.id,
          totalAmount: totalAmount.toFixed(2),
          items: {
            create: parsed.data.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return { productId: item.productId, quantity: item.quantity, unitPrice: product.price };
            }),
          },
        },
        include: { items: true },
      });

      for (const item of parsed.data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return order;
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("INSUFFICIENT_STOCK")) {
      return NextResponse.json({ message: "Insufficient stock" }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}
