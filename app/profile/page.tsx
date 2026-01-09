import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MapPin, Phone, Mail, Wallet, Clock } from "lucide-react";
import Link from "next/link";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = await db.getUserByEmail(session.user.email!);
    const orders = await db.getOrdersByUser(session.user.id);

    if (!user) return <div>Usuario no encontrado</div>;

    return (
        <div className="min-h-screen bg-[#7e92a8]">
            <SiteHeader />

            <main className="container py-12 max-w-6xl space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#122241] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-[#facc15] flex items-center justify-center text-[#122241]">
                                <User className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">Mi Cuenta</h1>
                        </div>
                        <p className="text-zinc-300">Gestiona tu información personal y revisa tus pedidos.</p>
                    </div>
                    <Link href="/" className="relative z-10">
                        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Catálogo
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left: Account Status & Balance */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-lg bg-[#5c6d8a] text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-[#facc15]" />
                                    Estado del Cliente
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${user.approved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-[#facc15]/20 text-[#facc15] border border-[#facc15]/30"
                                    }`}>
                                    {user.approved ? "✓ Cuenta Verificada" : "⏳ Pendiente de Aprobación"}
                                </div>
                                <p className="text-xs text-zinc-300 mt-4 leading-relaxed italic">
                                    {user.approved
                                        ? "Tu cuenta está activa. Puedes ver precios y realizar pedidos."
                                        : "Tu cuenta está siendo revisada por un administrador. Te notificaremos pronto."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg bg-[#122241] text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#facc15]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-[#facc15]" />
                                    Saldo Disponible
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-[#facc15]">
                                    ${user.balance.toLocaleString("es-AR")}
                                </div>
                                <p className="text-xs text-zinc-400 mt-2">Saldo a favor para tus próximas compras.</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Editable Profile Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-xl bg-white/95 backdrop-blur-md rounded-3xl">
                            <CardHeader>
                                <CardTitle className="text-[#122241]">Editar Perfil</CardTitle>
                                <CardDescription>Modifica tus datos de contacto y entrega.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProfileForm user={user} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Orders History Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                        <h2 className="text-2xl font-black text-[#122241]">Historial de Pedidos</h2>
                        <Badge variant="secondary" className="bg-[#122241] text-white">
                            {orders.length} Pedidos
                        </Badge>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white/50 backdrop-blur-sm p-12 rounded-3xl border-2 border-dashed border-white/30 text-center space-y-4">
                            <div className="h-16 w-16 bg-white/50 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                                <Clock className="h-8 w-8" />
                            </div>
                            <p className="text-zinc-600 font-medium">Aún no has realizado ningún pedido.</p>
                            <Link href="/">
                                <Button className="bg-[#122241] hover:bg-[#122241]/90 text-white font-bold border border-white/10 rounded-xl">Explorar catálogo</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {orders.map(order => (
                                <Card key={order.id} className="border-none shadow-lg bg-white/95 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3 bg-zinc-50 border-b">
                                        <div className="space-y-1">
                                            <CardTitle className="text-sm font-bold text-[#122241]">Pedido #{order.id.slice(0, 8)}</CardTitle>
                                            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                                                <Clock className="h-3 w-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                order.status === 'PREPARED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                        'bg-red-100 text-red-700 border border-red-200'
                                                }`}>
                                                {order.status === 'PENDING' ? 'Pendiente' :
                                                    order.status === 'PREPARED' ? 'Preparado' :
                                                        order.status === 'DELIVERED' ? 'Entregado' : 'Cancelado'}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5">
                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#122241]">{item.productName}</span>
                                                        <span className="text-xs text-zinc-500">{item.quantity} unidades</span>
                                                    </div>
                                                    <span className="font-medium text-zinc-600">${(item.priceAtPurchase * item.quantity).toLocaleString("es-AR")}</span>
                                                </div>
                                            ))}
                                            <div className="pt-3 border-t flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total abonado</span>
                                                <span className="text-lg font-black text-[#122241]">${order.total.toLocaleString("es-AR")}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

const Badge = ({ children, variant, className }: any) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>
        {children}
    </span>
);
