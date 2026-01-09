import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { BannerCarousel } from "@/components/banner-carousel";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#7e92a8]">
      <SiteHeader />

      <main className="container py-8 md:py-12 space-y-12 md:space-y-20">
        {/* Banner Section */}
        <BannerCarousel />

        {/* Presentation Text Section */}
        <section className="bg-white/95 backdrop-blur-md p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#facc15]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#122241]/5 rounded-full blur-3xl -ml-24 -mb-24"></div>

          <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#122241] flex items-center justify-center text-[#facc15] rotate-3 shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[#122241] tracking-tight">
                Hola, somos <span className="text-[#facc15] [text-shadow:_-1px_-1px_0_#122241,1px_-1px_0_#122241,-1px_1px_0_#122241,1px_1px_0_#122241]">Librería Rexy</span>
              </h1>
            </div>

            <div className="space-y-6 text-lg md:text-xl text-[#122241]/80 leading-relaxed font-medium">
              <p>
                Un espacio pensado para quienes aman crear, estudiar, trabajar y resolver todo en un solo lugar.
                En <span className="font-bold text-[#122241]">Rexy</span> vas a encontrar artículos de librería, papelería, insumos escolares, artículos de informática y mucho más, siempre buscando <span className="text-[#122241] underline decoration-[#facc15] decoration-4 underline-offset-4">buena calidad, buenos precios</span> y soluciones prácticas para el día a día.
              </p>

              <p>
                Creamos esta tienda online para que puedas ver todo nuestro catálogo de forma simple, comprar cuando quieras y aprovechar beneficios exclusivos.
                Si te logueás, vas a acceder a precios especiales, promociones, historial de compras y novedades antes que nadie.
              </p>

              <div className="pt-4 flex flex-col items-center gap-8">
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#facc15] to-transparent"></div>
                <p className="font-black text-2xl md:text-3xl text-[#122241] italic tracking-tight text-center">
                  Pasá, mirá tranquilo y hacé de Rexy tu librería de confianza.
                </p>

                <Link href="/catalog">
                  <Button className="bg-[#122241] hover:bg-[#122241]/90 text-white font-black px-12 py-8 rounded-2xl text-2xl shadow-2xl transition-all hover:scale-105 group">
                    Acceder al Catálogo
                    <ArrowRight className="ml-3 h-8 w-8 text-[#facc15] group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#122241] py-16 text-white overflow-hidden relative mt-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container relative z-10 text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-2xl font-black text-[#facc15] tracking-widest uppercase">Librería Rexy</h4>
            <div className="flex gap-4">
              {/* Placeholders for social links */}
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#facc15] hover:text-[#122241] cursor-pointer transition-all">📸</div>
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#facc15] hover:text-[#122241] cursor-pointer transition-all">👍</div>
            </div>
          </div>
          <div className="text-zinc-400 text-sm max-w-md mx-auto">
            <p>© 2026 Librería Rexy. Todos los derechos reservados.</p>
            <p className="mt-2 text-xs">Tu socio estratégico en insumos de librería, informática y papelería.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
