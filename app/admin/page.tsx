import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, AlertCircle } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
    const [users, orders, products] = await Promise.all([
        db.getUsers(),
        db.getOrders(),
        db.getProducts()
    ]);

    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const outOfStock = products.filter(p => (p.stock || 0) <= 0).length;
    const totalProfit = orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((acc, current) => acc + (current.profit || 0), 0);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-[#122241] uppercase tracking-tighter">Panel de Control</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-red-500/10 transition-colors"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-[#122241]">Pedidos Pendientes</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-[#122241]">{pendingOrders}</div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            Aguardando gestión
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#facc15]/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-[#facc15]/10 transition-colors"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-[#122241]">Ganancia Estimada</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 font-bold text-xs">$</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-green-600">${totalProfit.toLocaleString("es-AR")}</div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            Margen neto acumulado
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-zinc-500/10 transition-colors"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-[#122241]">Usuarios Registrados</CardTitle>
                        <Users className="h-4 w-4 text-[#122241]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-[#122241]">{users.length}</div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            Clientes en plataforma
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-orange-500/10 transition-colors"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-[#122241]">Sin Stock</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-[#122241]">{outOfStock}</div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            Reposición urgente
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
