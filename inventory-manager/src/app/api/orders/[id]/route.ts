import { OrderStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["FULFILLED", "CANCELLED"],
  FULFILLED: [],
  CANCELLED: [],
};

export async function GET(_req: NextRequest, { params }: Ctx) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { user: true, items: { include: { product: true } } },
  });
  if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.user.role !== Role.ADMIN) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { status } = (await req.json()) as { status?: OrderStatus };
  if (!status) return NextResponse.json({ message: "Status required" }, { status: 400 });
  const order = await prisma.order.findUnique({ where: { id: Number(params.id) } });
  if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (!validTransitions[order.status].includes(status)) {
    return NextResponse.json({ message: "Invalid status transition" }, { status: 400 });
  }
  const updated = await prisma.order.update({ where: { id: order.id }, data: { status } });
  return NextResponse.json(updated);
}
