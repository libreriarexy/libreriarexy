"use client";

import { useState, useMemo, useEffect } from "react";
import { Product, OrderItem, User as DBUser } from "@/types";
import { createOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Trash2,
    Plus,
    Printer,
    Calculator,
    CheckCircle,
    Package,
    Store,
    User as UserIcon,
    Calendar,
    Loader2,
    FileText,
    ChevronDown,
    X,
    Percent,
    TrendingUp
} from "lucide-react";
import { toast } from "@/components/ui/use-toast-simplified";

interface POSItem extends OrderItem {
    stock: number;
    cost: number;
}

type DocumentType = "REMITO" | "NOTA_CREDITO" | "PRESUPUESTO";

export function POSSystem({ products, users }: { products: Product[], users: DBUser[] }) {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<POSItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [docType, setDocType] = useState<DocumentType>("REMITO");
    const [userSearch, setUserSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<DBUser | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [discount, setDiscount] = useState<number>(0);

    // Filter products for search
    const filteredProducts = useMemo(() => {
        if (!search.trim()) return [];
        return products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 10);
    }, [search, products]);

    // Filter users for search
    const filteredUsers = useMemo(() => {
        if (!userSearch.trim()) return [];
        return users.filter(u =>
            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase())
        ).slice(0, 5);
    }, [userSearch, users]);

    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.productId === product.id);
        if (existing) {
            if (existing.quantity >= product.stock && docType !== "NOTA_CREDITO") {
                toast({ title: "Sin stock", description: "No hay más unidades disponibles." });
                return;
            }
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                productId: product.id,
                productName: product.name,
                quantity: 1,
                priceAtPurchase: product.price,
                costAtPurchase: product.cost, // snapshot for OrderItem
                cost: product.cost, // for local calc
                stock: product.stock
            }]);
        }
        setSearch("");
    };

    const updateQuantity = (id: string, qty: number) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const newQty = Math.max(0, qty);
        if (newQty > product.stock && docType !== "NOTA_CREDITO") {
            toast({ title: "Stock insuficiente", description: `Solo hay ${product.stock} disponibles.` });
            return;
        }

        if (newQty === 0) {
            setCart(cart.filter(item => item.productId !== id));
        } else {
            setCart(cart.map(item => item.productId === id ? { ...item, quantity: newQty } : item));
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const totalCost = cart.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
    const estimatedProfit = total - totalCost;
    const estimatedProfitNoDiscount = subtotal - totalCost;

    const handleProcess = async () => {
        if (cart.length === 0) return;
        setLoading(true);

        const userId = selectedUser?.id || "CONSUMIDOR_FINAL_LOCAL";
        const userEmail = selectedUser?.email || "anonimo@webrexy.com";

        // If it's a Budget (Presupuesto), we don't necessarily deduct stock in some systems,
        // but the user's request says "descuente todo automáticamente del stock todo lo que este cargado en ese remito".
        // For Note of Credit (Nota de Crédito), stock should probably go UP.
        const itemsToProcess = cart.map(item => ({
            ...item,
            quantity: docType === "NOTA_CREDITO" ? -item.quantity : item.quantity
        }));

        const result = await createOrder(
            itemsToProcess.map(({ stock, cost, ...rest }) => rest),
            total,
            userId,
            userEmail
        );

        if (result.success) {
            toast({
                title: `${docType} registrado`,
                description: `Orden #${result.orderId?.slice(0, 8)} creada exitosamente.`
            });
            setCart([]);
            setSelectedUser(null);
            setUserSearch("");
        } else {
            toast({ title: "Error", description: result.error || "No se pudo procesar la operación." });
        }
        setLoading(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Invoice Section */}
            <div className={`lg:col-span-2 space-y-6 ${isPrinting ? 'col-span-3' : ''}`}>
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 overflow-hidden print:shadow-none print:border-none print-section relative">

                    {/* Header: Document Type and Basic Info */}
                    <div className="bg-[#122241] p-8 text-white relative">
                        {/* Watermark/Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#facc15]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                            <div className="space-y-4 w-full md:w-auto">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-[#facc15] flex items-center justify-center text-[#122241] shadow-lg">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#facc15]">Tipo de Comprobante</span>
                                        <div className="flex items-center gap-2 group cursor-pointer print:hidden" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                                            <select
                                                value={docType}
                                                onChange={(e) => setDocType(e.target.value as DocumentType)}
                                                className="bg-transparent border-none text-2xl font-black uppercase tracking-tight p-0 focus:ring-0 cursor-pointer appearance-none"
                                            >
                                                <option value="REMITO" className="text-[#122241]">REMITO</option>
                                                <option value="NOTA_CREDITO" className="text-[#122241]">NOTA DE CRÉDITO</option>
                                                <option value="PRESUPUESTO" className="text-[#122241]">PRESUPUESTO</option>
                                            </select>
                                            <ChevronDown className="h-5 w-5 text-[#facc15] print:hidden" />
                                        </div>
                                        <div className="hidden print:block text-2xl font-black uppercase tracking-tight">
                                            {docType.replace("_", " ")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right space-y-1 w-full md:w-auto">
                                <h3 className="text-[#facc15] font-black text-xl uppercase tracking-tighter">Librería Rexy</h3>
                                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Nro de Control: #881-{Math.floor(Math.random() * 10000)}</p>
                                <div className="flex items-center justify-end gap-2 text-zinc-300 text-xs mt-2 bg-white/5 py-1 px-3 rounded-full inline-flex">
                                    <Calendar className="h-3 w-3 text-[#facc15]" />
                                    {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>

                        {/* Selection Row: Client info */}
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-[#facc15] uppercase tracking-[0.2em]">Condición de Venta</p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-lg bg-[#facc15] text-[#122241] text-[10px] font-black uppercase">Consumidor Final</span>
                                    <span className="px-3 py-1 rounded-lg bg-white/10 text-white text-[10px] font-black uppercase">Minorista</span>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <p className="text-[10px] font-black text-[#facc15] uppercase tracking-[0.2em]">Cliente / Destinatario</p>

                                {selectedUser ? (
                                    <div className="flex items-center justify-between bg-white/10 p-2 rounded-xl border border-white/20">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-[#facc15] flex items-center justify-center text-[#122241] text-xs font-black">
                                                {selectedUser.name[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold uppercase tracking-tight">{selectedUser.name}</span>
                                                <span className="text-[9px] text-zinc-400 font-medium">{selectedUser.email}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedUser(null); setUserSearch(""); }}
                                            className="p-1 hover:bg-white/10 rounded-full transition-colors print:hidden"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative print:hidden">
                                        <div className="relative">
                                            <Input
                                                placeholder="Nombre o buscar registrado..."
                                                value={userSearch}
                                                onChange={(e) => {
                                                    setUserSearch(e.target.value);
                                                    setShowUserDropdown(true);
                                                }}
                                                className="bg-white/5 border-white/20 text-white focus:ring-[#facc15]/20 h-10 rounded-xl pr-10"
                                            />
                                            {userSearch && (
                                                <button
                                                    onClick={() => setUserSearch("")}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>

                                        {showUserDropdown && userSearch.length > 0 && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-[100]">
                                                {/* Consumidor Final Option */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(null);
                                                        setUserSearch("");
                                                        setShowUserDropdown(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 transition-colors border-b"
                                                >
                                                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs font-black">
                                                        CF
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm font-bold text-[#122241] uppercase">Consumidor Final (Día)</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium">Venta rápida sin registro</span>
                                                    </div>
                                                </button>

                                                {filteredUsers.map(u => (
                                                    <button
                                                        key={u.id}
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setUserSearch(u.name);
                                                            setShowUserDropdown(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 transition-colors border-b last:border-0"
                                                    >
                                                        <div className="h-8 w-8 rounded-full bg-[#122241] flex items-center justify-center text-[#facc15] text-xs font-black">
                                                            {u.name[0].toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-bold text-[#122241] uppercase">{u.name}</span>
                                                            <span className="text-[10px] text-zinc-400 font-medium truncate w-48">{u.email}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {!userSearch && !selectedUser && (
                                            <p className="mt-1 text-[10px] text-zinc-400 italic font-bold">Por defecto: CONSUMIDOR FINAL</p>
                                        )}
                                        {userSearch && !selectedUser && filteredUsers.length === 0 && (
                                            <p className="mt-1 text-[10px] text-[#facc15] italic font-bold">Usando nombre manual</p>
                                        )}
                                    </div>
                                )}
                                <div className="hidden print:block text-sm font-bold uppercase">
                                    {selectedUser ? selectedUser.name : (userSearch || "CONSUMIDOR FINAL")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="p-0 overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-zinc-50 border-b border-zinc-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#122241]">Cant.</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#122241]">Detalle del Artículo</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#122241] text-right">Precio Unit.</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#122241] text-right">Subtotal</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#122241] text-right print:hidden">Stock</th>
                                    <th className="px-8 py-5 text-center print:hidden"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                                                <Package className="h-12 w-12 text-zinc-300" />
                                                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                                    Lista de artículos vacía
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map((item) => (
                                        <tr key={item.productId} className="hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-8 py-5 w-24">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                                                    className="w-full bg-transparent border-none font-black text-[#122241] focus:ring-0 p-0 text-sm"
                                                />
                                            </td>
                                            <td className="px-8 py-5 font-bold text-[#122241] min-w-[300px] uppercase text-xs">
                                                {item.productName}
                                            </td>
                                            <td className="px-8 py-5 text-zinc-500 font-bold text-sm text-right">
                                                ${item.priceAtPurchase.toLocaleString("es-AR")}
                                            </td>
                                            <td className="px-8 py-5 font-black text-[#122241] text-right text-sm">
                                                ${(item.priceAtPurchase * item.quantity).toLocaleString("es-AR")}
                                            </td>
                                            <td className="px-8 py-5 text-right print:hidden">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${item.stock <= 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                    {item.stock} u.
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right print:hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, 0)}
                                                    className="h-8 w-8 flex items-center justify-center rounded-xl bg-red-50 text-red-300 hover:text-red-500 hover:bg-red-100 transition-all ml-auto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Totals */}
                    {/* Footer Totals */}
                    <div className="p-10 bg-zinc-50 border-t flex flex-col md:flex-row justify-between items-start gap-8">
                        {/* Admin Margin Analysis */}
                        <div className="flex-1 space-y-3 print:hidden">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#122241]/40 mb-4">
                                <TrendingUp className="h-3 w-3" />
                                Monitor de Margen (Sólo Admin)
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-white border border-zinc-100 shadow-sm">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mb-1">Ganancia Bruta</p>
                                    <div className="text-sm font-black text-[#122241]">
                                        ${Math.round(estimatedProfitNoDiscount).toLocaleString("es-AR")}
                                    </div>
                                    <p className="text-[8px] font-black text-green-500 uppercase tracking-tighter mt-1">
                                        ({subtotal > 0 ? ((estimatedProfitNoDiscount / subtotal) * 100).toFixed(1) : 0}%)
                                    </p>
                                </div>
                                <div className="p-4 rounded-3xl bg-white border border-zinc-100 shadow-sm border-l-4 border-l-[#facc15]">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mb-1">Ganancia Neta (Final)</p>
                                    <div className={`text-sm font-black ${estimatedProfit < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                        ${Math.round(estimatedProfit).toLocaleString("es-AR")}
                                    </div>
                                    <p className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${estimatedProfit < 0 ? 'text-red-400' : 'text-green-500'}`}>
                                        ({total > 0 ? ((estimatedProfit / total) * 100).toFixed(1) : 0}%)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-80 space-y-3">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-zinc-400 uppercase tracking-[0.2em] text-[10px]">Subtotal Acumulado</span>
                                <span className="text-[#122241]">${Math.round(subtotal).toLocaleString("es-AR")}</span>
                            </div>

                            {/* Discount Input Section */}
                            <div className="flex items-center justify-between py-3 border-t border-dashed border-zinc-200 print:hidden">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-lg bg-[#facc15]/10 flex items-center justify-center text-[#facc15]">
                                        <Percent className="h-3 w-3" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#122241]">Descuento %</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={discount || ""}
                                        onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                                        className="w-16 h-8 text-right font-black text-[#122241] rounded-xl border-2 border-[#facc15] bg-white focus:ring-[#facc15]/30 p-1"
                                    />
                                    <span className="text-xs font-bold text-zinc-400">%</span>
                                </div>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-sm font-bold text-red-500">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Bonificación ({discount}%)</span>
                                    <span>- ${Math.round(discountAmount).toLocaleString("es-AR")}</span>
                                </div>
                            )}

                            <div className="flex justify-between py-4 border-t border-zinc-200">
                                <span className="text-[#122241] font-black uppercase tracking-[0.3em] text-[11px] self-center">Importe Total</span>
                                <span className="text-3xl font-black text-[#122241] drop-shadow-sm">${Math.round(total).toLocaleString("es-AR")}</span>
                            </div>
                            <div className="w-full text-center mt-6 border-t border-zinc-200 pt-6 hidden print:block">
                                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Este documento no es válido como factura - Librería Rexy</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* POS Controls */}
                <div className="flex flex-wrap gap-4 print:hidden">
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-14 border-zinc-200 bg-white text-[#122241] font-black px-8 rounded-2xl gap-3 shadow-lg hover:bg-zinc-50 transition-all hover:scale-105"
                        onClick={handlePrint}
                        disabled={cart.length === 0}
                    >
                        <Printer className="h-5 w-5 text-[#facc15]" />
                        Imprimir {docType.charAt(0) + docType.toLowerCase().slice(1).replace("_", " ")}
                    </Button>
                    <Button
                        size="lg"
                        className="flex-1 h-14 bg-[#122241] hover:bg-[#122241]/90 text-white font-black px-10 rounded-2xl gap-3 shadow-2xl shadow-[#122241]/20 transition-all hover:scale-105 active:scale-95"
                        onClick={handleProcess}
                        disabled={loading || cart.length === 0}
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5 text-[#facc15]" />}
                        <span className="uppercase tracking-widest text-xs">Confirmar Operación</span>
                    </Button>
                </div>
            </div>

            {/* Sidebar Search */}
            <div className="space-y-6 print:hidden">
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-2xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-[#facc15] flex items-center justify-center text-[#122241] shadow-lg shadow-[#facc15]/20 rotate-3">
                            <Search className="h-5 w-5" />
                        </div>
                        <h3 className="font-black text-[#122241] uppercase tracking-tight text-lg">Catálogo de Artículos</h3>
                    </div>

                    <div className="relative">
                        <Input
                            placeholder="Buscar por nombre o ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-14 border-zinc-100 rounded-2xl bg-zinc-50 focus-visible:ring-[#facc15]/30 text-sm font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
                    </div>

                    <div className="space-y-2 divide-y divide-zinc-50 pt-2 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 active:bg-zinc-100 rounded-2xl transition-all text-left group border border-transparent hover:border-zinc-100"
                                >
                                    <div className="space-y-1 pr-4">
                                        <p className="text-xs font-black text-[#122241] uppercase tracking-tight leading-tight group-hover:text-[#facc15] transition-colors">{product.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-white bg-[#122241] px-2 py-0.5 rounded uppercase tracking-tighter">
                                                ID: {product.id.slice(0, 6)}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase ${product.stock <= 5 ? 'text-red-500' : 'text-zinc-400'}`}>
                                                Disp: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#122241] font-black shrink-0">
                                        <span className="text-sm">${product.price.toLocaleString("es-AR")}</span>
                                        <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-[#facc15] transition-all">
                                            <Plus className="h-4 w-4 text-zinc-300 group-hover:text-[#122241] transition-colors" />
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : search.length > 2 ? (
                            <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                                <Package className="h-10 w-10 text-zinc-300 mb-2" />
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sin resultados</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-10 opacity-20">
                                <Calculator className="h-12 w-12 text-zinc-300 mb-2" />
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Iniciá una búsqueda para agregar artículos</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Info */}
                <div className="bg-[#122241] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#facc15]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                    <h4 className="font-black text-[#facc15] uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Protocolo POS
                    </h4>
                    <ul className="text-[10px] text-zinc-300 space-y-3 font-bold uppercase tracking-wider leading-relaxed">
                        <li className="flex gap-2">
                            <span className="text-[#facc15]">•</span>
                            <span>Podés emitir Remitos, Notas de Crédito o Presupuestos.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-[#facc15]">•</span>
                            <span>Elegí un cliente registrado para asignar la venta a su cuenta.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-[#facc15]">•</span>
                            <span>Las cantidades se descuentan del stock al confirmar.</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-section, .print-section * {
                        visibility: visible;
                    }
                    .print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    nav, footer, button, .print\\:hidden, div[role="dropdown"] {
                        display: none !important;
                    }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ddd;
                }
            `}</style>
        </div>
    );
}
