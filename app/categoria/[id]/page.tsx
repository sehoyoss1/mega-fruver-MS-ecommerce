import { prisma } from "../../../lib/prisma"
import ProductCard from "../../../components/ProductCard"
import CartButton from "../../../components/CartButton"
import Link from "next/link"
import { notFound } from "next/navigation"

const diccionarioCategorias: Record<string, { nombre: string, emoji: string }> = {
  "ofertas": { nombre: "Ofertas", emoji: "🔥" },
  "frutas": { nombre: "Frutas", emoji: "🍎" },
  "verduras": { nombre: "Verduras", emoji: "🥦" },
  "hierbas": { nombre: "Hierbas", emoji: "🌿" },
  "granos": { nombre: "Granos", emoji: "🌾" },
  "tienda": { nombre: "Tienda", emoji: "🏪" }
}

export default async function CategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const categoriaId = id.toLowerCase()
  const infoCategoria = diccionarioCategorias[categoriaId]

  if (!infoCategoria) {
    notFound()
  }

  let productos = []
  
  if (categoriaId === "ofertas") {
    productos = await prisma.product.findMany({
      where: { isOffer: true },
      include: { category: true }
    })
  } else {
    productos = await prisma.product.findMany({
      where: { 
        category: { 
          name: infoCategoria.nombre 
        } 
      },
      include: { category: true }
    })
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-32">
      
      {/* BARRA SUPERIOR SINCRONIZADA CON EL HOME (VERDE PREMIUM) */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-green-950 via-green-900 to-mf-green shadow-lg pt-4 pb-3">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-2">
            
            <div className="flex items-center gap-3">
              {/* Botón Volver estilizado tipo Cristal Blanco */}
              <Link href="/" className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-colors font-bold text-xl pb-1">
                ←
              </Link>
              
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{infoCategoria.emoji}</span> {infoCategoria.nombre}
              </h1>
            </div>

            <CartButton />
          </div>
        </div>
      </nav>

      {/* CONTENIDO DE PRODUCTOS EN CUADRÍCULA */}
      <div className="pt-6 max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>

        {productos.length === 0 && (
          <div className="w-full text-center py-20">
            <span className="text-6xl block mb-4 grayscale opacity-50">{infoCategoria.emoji}</span>
            <h3 className="text-lg font-bold text-gray-800">No hay productos aquí</h3>
            <p className="text-gray-500 mt-1">Pronto agregaremos lo mejor en {infoCategoria.nombre.toLowerCase()}.</p>
            <Link href="/" className="inline-block mt-6 px-6 py-3 bg-mf-green text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
              Volver al inicio
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}