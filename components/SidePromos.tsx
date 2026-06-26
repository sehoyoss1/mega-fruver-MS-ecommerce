"use client"
import { useState, useEffect } from "react"

export default function SidePromos({ side }: { side: "left" | "right" }) {
  const [current, setCurrent] = useState(0)

  // Imágenes verticales (formato retrato). Luego las cambiaremos por las que suba el Admin.
  const banners = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?q=80&w=600&auto=format&fit=crop"  
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [banners.length])

  // Posicionamiento dinámico según el lado
  const positionClass = side === "left" ? "left-4 2xl:left-8" : "right-4 2xl:right-8"

  return (
    // Solo se muestra en pantallas grandes (xl). En celulares se oculta para no tapar los productos.
    <div className={`hidden xl:block fixed top-40 bottom-10 w-[160px] 2xl:w-[220px] rounded-[2rem] overflow-hidden shadow-xl z-10 ${positionClass}`}>
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-0"
          }`}
        >
          {/* Degradado oscuro para que el texto resalte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
          
          <img 
            src={banner} 
            alt={`Promo ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />

          {/* Etiqueta decorativa sobre la imagen */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
            <span className="text-white font-black text-xs tracking-wider uppercase border-2 border-white/50 rounded-xl px-3 py-1 bg-white/20 backdrop-blur-sm">
              Promoción
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}