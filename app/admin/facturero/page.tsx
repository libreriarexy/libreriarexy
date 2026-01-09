import { db } from "@/lib/db";
import { POSSystem } from "@/components/pos-system";
import { Receipt } from "lucide-react";

export const revalidate = 0; // Don't cache admin pages

export default async function FactureroPage() {
    const [products, users] = await Promise.all([
        db.getProducts(),
        db.getUsers()
    ]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#122241] flex items-center justify-center text-[#facc15] shadow-lg">
                    <Receipt className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-[#122241] uppercase tracking-tighter">Facturero / POS</h1>
                    <p className="text-zinc-500 text-sm font-medium">Terminal de ventas para atención presencial en el local.</p>
                </div>
            </div>

            <POSSystem products={products} users={users} />
        </div>
    );
}
