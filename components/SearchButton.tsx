"use client"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useCartStore } from "../store/cartStore"

interface Product {
  id: string
  name: string
  price: number
  unit: string // Ajustado al campo que uses en tu ProductCard (measureUnit o unit)
  image?: string | null
}

export default function SearchButton({ products }: { products: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Bloquear scroll de fondo cuando el buscador esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  // Filtrar productos según lo que escriba el cliente
  const filteredProducts = query.trim() === "" 
    ? [] 
    : products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

  if (!mounted) return null

  return (
    <>
      {/* El botón de la lupa original de tu barra superior */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 md:w-10 md:h-10 shrink-0 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center border border-gray-200 shadow-sm hover:scale-105 transition-transform text-gray-500 text-sm md:text-base cursor-pointer"
      >
        🔍
      </button>

      {/* Modal del buscador usando Portal para evitar bloqueos de capas */}
      {isOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-10 md:pt-20" style={{ zIndex: 99999 }}>
          <div className="bg-white w-full max-w-xl rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[75vh]">
            
            {/* Input de búsqueda */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 shrink-0">
              <span className="text-xl text-gray-400">🔍</span>
              <input 
                type="text" 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué estás buscando hoy? Ej: Tomate, Manzana..." 
                className="w-full text-base md:text-lg bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium"
              />
              <button 
                onClick={() => { setIsOpen(false); setQuery(""); }}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm bg-gray-100 px-3 py-1.5 rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>

            {/* Resultados de la búsqueda */}
            <div className="overflow-y-auto flex-1 custom-scrollbar mt-4 pr-1">
              {query.trim() !== "" && filteredProducts.length === 0 && (
                <p className="text-center text-gray-400 py-8 font-medium text-sm">
                  No encontramos productos que coincidan con "{query}" 😟
                </p>
              )}

              {query.trim() === "" && (
                <div className="text-center py-8 text-gray-400 text-sm font-medium">
                  🚀 Escribe el nombre de tu fruta o verdura favorita para buscarla al instante.
                </div>
              )}

              <div className="space-y-2">
                {filteredProducts.map((producto) => (
                  <div key={producto.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:bg-gray-100/50 transition-colors">
                    <div>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{producto.name}</p>
                      <p className="text-xs text-mf-green font-black mt-0.5">${producto.price} <span className="text-gray-400 font-medium">/ {producto.measureUnit?.toLowerCase() || 'un'}</span></p>
                    </div>
<button 
                      onClick={() => {
                        // AQUÍ ESTÁ LA MAGIA: Pasamos el producto entero primero, y un 1 como segundo parámetro
                        // @ts-ignore
                        addItem(producto, 1)
                        
                        setIsOpen(false)
                        setQuery("")
                      }}
                      className="bg-mf-green text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                    >
                      + Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  )
}