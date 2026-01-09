"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
    {
        id: 1,
        image: "/images/banners/banner_redes.png",
        title: "Rexy en Instagram",
        description: "Seguinos para enterarte de ingresos, sorteos y tips escolares.",
        buttonText: "Visitar Instagram",
        link: "https://www.instagram.com/rexy.libreria/",
    },
    {
        id: 2,
        image: "/images/banners/banner_escolar.png",
        title: "Listas Escolares 2026",
        description: "Traenos tu lista y llevate todo con un 15% de descuento. ¡Ahorrá tiempo y dinero!",
        buttonText: "Ver Promociones",
        link: "/catalog",
    }
];

export function BannerCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="relative w-full h-[350px] md:h-[550px] overflow-hidden rounded-[2.5rem] shadow-2xl group">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-[#142646]">
                        <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-contain opacity-100"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#122241]/40 via-transparent to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-30 h-full flex flex-col justify-center px-8 md:px-20 max-w-xl md:max-w-2xl space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            {banner.title.split(' ').map((word, i) => (
                                <span key={i} className={word.includes('15%') || word.includes('Rexy') || word.includes('Instagram') ? 'text-[#facc15]' : ''}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>
                        <p className="text-lg text-white font-bold drop-shadow-md">
                            {banner.description}
                        </p>
                        <div className="pt-2">
                            <Button
                                className="bg-[#facc15] text-[#122241] hover:bg-[#eab308] font-black px-8 py-6 rounded-2xl text-lg shadow-xl shadow-yellow-500/20 border-none transition-transform hover:scale-105"
                                onClick={() => {
                                    if (banner.link.startsWith('#')) {
                                        const el = document.getElementById(banner.link.substring(1));
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        window.open(banner.link, '_blank');
                                    }
                                }}
                            >
                                {banner.buttonText}
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-[#facc15]" : "w-2 bg-white/40 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </div>
    );
}
