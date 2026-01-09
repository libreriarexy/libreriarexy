import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/print-button"; // Client component

export default async function PrintOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const order = (await db.getOrders()).find(o => o.id === orderId);

    if (!order) return <div className="p-8 text-center text-red-500 font-bold">Pedido no encontrado (ID: {orderId})</div>;

    // Authorization Check
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = order.userId === session.user.id;

    if (!isAdmin && !isOwner) {
        return <div>No tienes permiso para ver este remito.</div>;
    }

    const user = await db.getUserByEmail(order.userEmail);

    return (
        <div className="min-h-screen bg-white text-black p-8 max-w-2xl mx-auto print:p-0 print:max-w-none">
            {/* Action Bar - Hidden on Print */}
            <div className="mb-8 flex justify-end print:hidden">
                <PrintButton />
            </div>

            {/* Remito / Invoice Content */}
            <div className="border p-8 print:border-0 print:p-0">
                <header className="flex justify-between items-start mb-8 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <img src="/logo.jpg" alt="Librería Rexy" className="h-20 w-auto object-contain" />
                        <div>
                            <h1 className="text-xl font-bold uppercase tracking-tight">Librería Rexy</h1>
                            <p className="text-xs text-gray-500 italic">Insumos & Papelería</p>
                            <p className="text-[10px] text-gray-400">Av. Siempre Viva 123 - Santa Fe</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-light text-gray-400">REMITO</h2>
                        <p className="font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </header>

                <section className="mb-8">
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Cliente</h3>
                    <div className="text-sm">
                        <p className="font-bold text-lg">{user?.name || order.userEmail}</p>
                        <p>{order.userEmail}</p>
                        <p className="mt-2">Condición IVA: Consumidor Final</p>
                    </div>
                </section>

                <table className="w-full text-sm mb-8">
                    <thead className="border-b-2 border-black">
                        <tr>
                            <th className="text-left py-2">Cant</th>
                            <th className="text-left py-2">Detalle</th>
                            <th className="text-right py-2">P. Unit</th>
                            <th className="text-right py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, i) => (
                            <tr key={i} className="border-b border-dashed border-gray-300">
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2">{item.productName}</td>
                                <td className="py-2 text-right">${item.priceAtPurchase.toLocaleString("es-AR")}</td>
                                <td className="py-2 text-right font-medium">${(item.priceAtPurchase * item.quantity).toLocaleString("es-AR")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <footer className="flex justify-end border-t-2 border-black pt-4">
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase text-gray-500">Total a Pagar</p>
                        <p className="text-3xl font-bold">${order.total.toLocaleString("es-AR")}</p>
                    </div>
                </footer>

                <div className="mt-12 pt-8 text-center text-xs text-gray-400 border-t print:mt-auto">
                    <p>Documento no válido como factura.</p>
                    <p className="mt-1">Gracias por su compra.</p>
                </div>
            </div>
        </div>
    );
}
