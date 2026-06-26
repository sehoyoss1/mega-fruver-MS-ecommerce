import { prisma } from "../lib/prisma"
import ProductCard from "../components/ProductCard"
import CartButton from "../components/CartButton"
import Link from "next/link"
import SearchButton from "../components/SearchButton"
import SidePromos from "../components/SidePromos"
import PromoBanner from "../components/PromoBanner"
export const dynamic = 'force-dynamic';

export default async function Home() {
  const productos = await prisma.product.findMany({
    include: { category: true }
  })

  const categorias = [
    { id: "ofertas", nombre: "Ofertas", emoji: "🔥" },
    { id: "frutas", nombre: "Frutas", emoji: "🍎" },
    { id: "verduras", nombre: "Verduras", emoji: "🥦" },
    { id: "hierbas", nombre: "Hierbas", emoji: "🌿" },
    { id: "granos", nombre: "Granos", emoji: "🌾" },
    { id: "tienda", nombre: "Tienda", emoji: "🏪" }
  ]

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-32 relative">
      
{/* BANNERS LATERALES (Solo visibles en monitores anchos) */}
      <div className="hidden 2xl:block">
        <SidePromos side="left" />
        <SidePromos side="right" />
      </div>

{/* BARRA SUPERIOR: VERDE CORPORATIVO PREMIUM */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-green-950 via-green-900 to-mf-green shadow-lg pt-4 pb-3">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-3 px-4 md:px-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-white truncate pr-2">
              MegaFruver<span className="text-green-300">MS</span><span className="text-green-300 text-3xl md:text-4xl leading-none">.</span>
            </h1>
            
            {/* AQUÍ ESTÁ EL CAMBIO: Agregamos el Link secreto */}
            <div className="flex items-center gap-2 md:gap-3">
              <SearchButton products={productos} />
              <CartButton />
              
              {/* LA PUERTA SECRETA (Botón de Ajustes/Login) */}
              <Link 
                href="/login" 
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 text-white backdrop-blur-sm hover:bg-white/20 border border-white/10 transition-all hover:rotate-90"
                title="Acceso Interno"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex overflow-x-auto custom-scrollbar gap-2 md:gap-3 px-4 md:px-6 pb-2 snap-x" style={{ scrollBehavior: 'smooth' }}>
            {categorias.map((cat, index) => (
              <a 
                key={cat.id}
                href={`#${cat.id}`}
                className={`whitespace-nowrap px-4 md:px-5 py-1.5 md:py-2 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all snap-start ${
                  index === 0 
                    ? "bg-white text-green-900 shadow-md" 
                    : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border border-white/10"
                }`}
              >
                {cat.emoji} {cat.nombre}
              </a>
            ))}
            <div className="w-2 md:w-4 shrink-0"></div>
          </div>
          
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="pt-6 max-w-7xl mx-auto px-4 md:px-6 relative z-20">
        
        <PromoBanner />

        {categorias.map((cat) => {
          const productosCategoria = cat.id === "ofertas"
            ? productos.filter(p => p.isOffer === true) 
            : productos.filter(p => p.category?.name?.toLowerCase() === cat.nombre.toLowerCase())

          if (productosCategoria.length === 0) return null;

          return (
            <section key={cat.id} id={cat.id} className="mb-10 scroll-mt-32">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>{cat.emoji}</span> {cat.nombre}
                </h2>
                <Link href={`/categoria/${cat.id}`} className="text-green-700 font-bold text-xs md:text-sm hover:underline">
                  Ver todos
                </Link>
              </div>
              
              {/* COMPACTACIÓN AQUÍ: Rediseño del ancho de tarjetas en responsive */}
              <div className="flex flex-nowrap overflow-x-auto custom-scrollbar gap-3 md:gap-6 pb-6 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                {productosCategoria.map((producto) => (
                  <div 
                    key={producto.id} 
                    className="w-[180px] sm:w-[220px] md:w-[280px] shrink-0 snap-center md:snap-start"
                  >
                    <ProductCard product={producto} />
                  </div>
                ))}
                <div className="w-2 shrink-0 md:hidden"></div>
              </div>
            </section>
          )
        })}

        {productos.length === 0 && (
          <div className="w-full text-center py-10 text-gray-400 font-medium text-sm">
            Aún no hay productos, ve al panel de administrador para crearlos.
          </div>
        )}

      </div>
    </main>
  )
}