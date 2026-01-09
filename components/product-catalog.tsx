"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCatalogProps {
    initialProducts: Product[];
}

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("default");

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = initialProducts.map(p => p.category);
        return ["Todas", ...Array.from(new Set(cats))];
    }, [initialProducts]);

    // Filter and Sort Logic
    const filteredProducts = useMemo(() => {
        let results = initialProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;

            const price = p.price;
            const matchesMinPrice = minPrice === "" || price >= parseFloat(minPrice);
            const matchesMaxPrice = maxPrice === "" || price <= parseFloat(maxPrice);

            return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
        });

        // Sorting
        if (sortBy === "price-asc") {
            results.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            results.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name-asc") {
            results.sort((a, b) => a.name.localeCompare(b.name));
        }

        return results;
    }, [initialProducts, search, selectedCategory, minPrice, maxPrice, sortBy]);

    return (
        <div className="space-y-8">
            {/* Search and Filters Bar */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 sticky top-20 z-40 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#122241]/60" />
                        <Input
                            placeholder="¿Qué estás buscando? (ej: marcadores, resmas...)"
                            className="pl-10 h-12 bg-white/50 border-zinc-200 text-[#122241] placeholder:text-[#122241]/40 focus-visible:ring-primary/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                    {/* Category Filter */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#122241]/70 px-1">Categoría</label>
                        <select
                            className="h-10 w-full rounded-md border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-[#122241] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="text-[#122241]">{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#122241]/70 px-1">Rango de Precio ($)</label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                className="h-10 w-24 bg-white/80 border-zinc-200 text-[#122241]"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span className="text-[#122241]/40">-</span>
                            <Input
                                type="number"
                                placeholder="Max"
                                className="h-10 w-24 bg-white/80 border-zinc-200 text-[#122241]"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#122241]/70 px-1">Orden</label>
                        <select
                            className="h-10 w-full rounded-md border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-[#122241] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default" className="text-[#122241]">Relevancia</option>
                            <option value="price-asc" className="text-[#122241]">Menor precio</option>
                            <option value="price-desc" className="text-[#122241]">Mayor precio</option>
                            <option value="name-asc" className="text-[#122241]">Nombre (A-Z)</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(search || selectedCategory !== "Todas" || minPrice || maxPrice || sortBy !== "default") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-5 text-[#122241] hover:text-destructive hover:bg-destructive/5"
                            onClick={() => {
                                setSearch("");
                                setSelectedCategory("Todas");
                                setMinPrice("");
                                setMaxPrice("");
                                setSortBy("default");
                            }}
                        >
                            Limpiar
                        </Button>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <Search className="h-12 w-12 opacity-20" />
                        <div>
                            <p className="text-lg font-bold text-zinc-600">No encontramos productos</p>
                            <p className="text-sm">Intenta ajustar tu búsqueda o los filtros aplicados.</p>
                        </div>
                        <Button variant="outline" onClick={() => {
                            setSearch("");
                            setSelectedCategory("Todas");
                            setMinPrice("");
                            setMaxPrice("");
                            setSortBy("default");
                        }}>
                            Ver todo el catálogo
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
