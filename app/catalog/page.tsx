import { db } from "@/lib/db";
import { ProductCatalog } from "@/components/product-catalog";
import { SiteHeader } from "@/components/site-header";
import { Star } from "lucide-react";

export default async function CatalogPage() {
    const products = await db.getProducts();

    // Filter active products
    const activeProducts = products.filter(p => p.active);

    return (
        <div className="min-h-screen bg-[#7e92a8]">
            <SiteHeader />

            <main className="container py-12 space-y-8">
                {/* Catalog Section */}
                <section id="catalog" className="space-y-8">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="flex items-center gap-3">
                            <Star className="h-6 w-6 text-[#facc15] fill-[#facc15]" />
                            <h1 className="text-4xl md:text-5xl font-black text-[#122241] uppercase tracking-tighter">Nuestro Catálogo</h1>
                            <Star className="h-6 w-6 text-[#facc15] fill-[#facc15]" />
                        </div>
                        <p className="text-[#122241]/70 font-medium">Explorá todos nuestros productos y armá tu pedido.</p>
                    </div>
                    <ProductCatalog initialProducts={activeProducts} />
                </section>
            </main>

            <footer className="bg-[#122241] py-16 text-white overflow-hidden relative mt-20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="container relative z-10 text-center space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <h4 className="text-2xl font-black text-[#facc15] tracking-widest uppercase">Librería Rexy</h4>
                    </div>
                    <div className="text-zinc-400 text-sm max-w-md mx-auto">
                        <p>© 2026 Librería Rexy. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
