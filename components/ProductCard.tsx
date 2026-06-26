"use client"
import { useState } from "react"
import { useCartStore } from "../store/cartStore"

export default function ProductCard({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  
  // 1. Detectamos si el producto se vende por peso (libras/pounds)
  const baseUnit = product.measureUnit?.toLowerCase() || 'un'
  const isWeight = baseUnit === 'pound' || baseUnit === 'libra' || baseUnit === 'libras'
  
  // 2. Estado para la unidad seleccionada por el cliente (por defecto 'lb' si es peso, si no 'un')
  const [selectedUnit, setSelectedUnit] = useState(isWeight ? 'lb' : baseUnit.substring(0, 3))

  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    // 3. Lógica de conversión: En Colombia 1 Kilo = 2 Libras.
    // Si eligen Kilo, internamente al carrito le mandamos el doble de cantidad en libras.
    let finalQuantity = quantity
    if (isWeight && selectedUnit === 'kg') {
      finalQuantity = quantity * 2 
    }
    
    // @ts-ignore
    addItem(product, finalQuantity)
    
    // Reseteamos después de agregar
    setQuantity(1)
    if (isWeight) setSelectedUnit('lb')
  }

  // 4. Multiplicador visual de precio (Si eligen Kilo, mostramos el precio x2)
  const displayPrice = (isWeight && selectedUnit === 'kg') ? product.price * 2 : product.price

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      
      {/* IMAGEN */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden shrink-0">
        {product.isOffer && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg z-10 shadow-sm">
            OFERTA
          </span>
        )}
        
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-50 grayscale">🛒</span>
        )}
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="flex flex-col flex-1">
        
        {/* Título y precio base */}
        <div className="mb-2">
          <h3 className="font-bold text-sm text-gray-800 leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Base: ${product.price} / {isWeight ? 'lb' : 'un'}
          </p>
        </div>

        {/* Precio dinámico (Cambia si eligen KG) */}
        <div className="mb-2">
          <span className="font-black text-lg text-mf-green leading-none transition-all">
            ${displayPrice}
          </span>
        </div>

        {/* CONTROLES */}
        <div className="mt-auto space-y-2">
          
          {/* Selector de cantidad y UNIDAD */}
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 h-8 overflow-hidden">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-full flex items-center justify-center text-gray-500 font-black hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            
            <div className="flex-1 flex items-center justify-center gap-1 font-bold text-xs text-gray-700">
              <span>{quantity}</span>
              {/* MAGIA: Selector de unidad si es un producto de peso */}
              {isWeight ? (
                <select 
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="bg-transparent font-black text-mf-green outline-none cursor-pointer text-xs"
                >
                  <option value="lb">lb</option>
                  <option value="kg">kg</option>
                </select>
              ) : (
                <span>{selectedUnit}</span>
              )}
            </div>

            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-full flex items-center justify-center text-gray-500 font-black hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>

          {/* Botón Agregar */}
          <button 
            onClick={handleAdd}
            className="w-full bg-mf-green hover:bg-green-600 text-white font-bold text-xs h-9 rounded-lg transition-colors shadow-sm"
          >
            Agregar
          </button>
          
        </div>
        
      </div>
    </div>
  )
}