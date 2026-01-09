import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusSelector } from "@/components/admin/order-status-selector";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage() {
    const orders = await db.getOrders();

    // Sort by date desc
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h2>

            {sortedOrders.length === 0 ? (
                <p>No hay pedidos registrados.</p>
            ) : (
                <div className="grid gap-4">
                    {sortedOrders.map(order => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
                                <div>
                                    <CardTitle className="text-base">Pedido #{order.id.slice(0, 8)}</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {order.userEmail} - {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link href={`/admin/orders/${order.id}/print`}>
                                        <Button variant="outline" size="sm">Imprimir Remito</Button>
                                    </Link>
                                    <div className="w-40">
                                        <OrderStatusSelector order={order} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="text-sm space-y-1">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between">
                                            <span>{item.quantity} x {item.productName}</span>
                                            <span className="text-muted-foreground">${item.priceAtPurchase * item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 font-bold text-right border-t pt-2">
                                    Total: ${order.total.toLocaleString("es-AR")}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
