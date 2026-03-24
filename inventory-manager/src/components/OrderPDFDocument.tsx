import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12 },
  title: { fontSize: 16, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
});

type Props = {
  order: {
    orderNumber: string;
    createdAt: string | Date;
    status: string;
    totalAmount: number | string | { toString(): string };
    items: { id: number; quantity: number; unitPrice: number | string | { toString(): string }; product: { name: string } }[];
  };
};

export function OrderPDFDocument({ order }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Order {order.orderNumber}</Text>
        <Text>Status: {order.status}</Text>
        <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
        <View style={{ marginTop: 12 }}>
          {order.items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text>{item.product.name}</Text>
              <Text>
                {item.quantity} x ${Number(item.unitPrice).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        <Text style={{ marginTop: 16 }}>Total: ${Number(order.totalAmount).toFixed(2)}</Text>
      </Page>
    </Document>
  );
}
