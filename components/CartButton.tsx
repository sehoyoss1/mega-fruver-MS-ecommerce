"use client"

import { useState } from "react"
import { useCartStore } from "../store/cartStore"
import CartModal from "./CartModal" // <-- 1. CAMBIAMOS ESTO: Importamos CartModal en vez de CartDrawer

export default function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCartStore()
  
  const totalItems = items.length

  return (
    <>
      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative w-9 h-9 md:w-10 md:h-10 shrink-0 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center border border-gray-200 shadow-sm hover:scale-105 transition-transform text-gray-500 text-sm md:text-base cursor-pointer"
      >
        🛒
        {/* Globito rojo contador */}
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in">
            {totalItems}
          </span>
        )}
      </button>

      {/* 2. CAMBIAMOS ESTO: Ahora invocamos el CartModal aquí también */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}