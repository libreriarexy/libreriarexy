import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, ShoppingCart, LogOut, Receipt } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-zinc-900 text-white p-4 flex flex-col">
                <div className="mb-8 p-2">
                    <h1 className="text-xl font-bold tracking-wider">WEBREXY ADMIN</h1>
                </div>
                <nav className="flex-1 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/users">
                        <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
                            <Users className="mr-2 h-4 w-4" />
                            Usuarios
                        </Button>
                    </Link>
                    <Link href="/admin/orders">
                        <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Pedidos
                        </Button>
                    </Link>
                    <Link href="/admin/facturero">
                        <Button variant="ghost" className="w-full justify-start text-[#facc15] hover:text-white hover:bg-zinc-800 font-bold">
                            <Receipt className="mr-2 h-4 w-4" />
                            Facturero
                        </Button>
                    </Link>
                </nav>
                <div className="mt-auto">
                    <Link href="/">
                        <Button variant="outline" className="w-full text-black border-zinc-700 hover:bg-zinc-200">
                            <LogOut className="mr-2 h-4 w-4" />
                            Volver a Tienda
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-8">
                {children}
            </main>
        </div>
    );
}
