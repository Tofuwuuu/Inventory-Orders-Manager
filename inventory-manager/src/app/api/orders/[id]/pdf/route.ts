import { renderToStream } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { OrderPDFDocument } from "@/components/OrderPDFDocument";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { items: { include: { product: true } } },
  });
  if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const stream = await renderToStream(OrderPDFDocument({ order }) as never);
  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${order.orderNumber}.pdf"`,
    },
  });
}
