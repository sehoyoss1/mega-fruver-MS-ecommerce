"use client"

import { useState } from "react"
import { useCartStore } from "../store/cartStore"
import CartModal from "./CartModal" // Importamos el modal que creamos

export default function CartSummary() {
  const { items, total } = useCartStore()
  const [isModalOpen, setIsModalOpen] = useState(false) // Esto es lo que faltaba

  if (items.length === 0) return null

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
          
          <div className="flex items-center gap-4">
            <div className="bg-mf-green text-white font-bold h-12 w-12 flex items-center justify-center rounded-xl text-lg">
              {totalItems}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total a pagar:</p>
              <p className="text-2xl font-black text-white">${total}</p>
            </div>
          </div>
          
          {/* Al hacer click aquí, abrimos el modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-mf-green hover:bg-green-600 active:scale-95 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
          >
            <span>Ver pedido</span>
            <span className="text-xl">🛒</span>
          </button>
        </div>
      </div>

      {/* Aquí vive el modal esperando a que le den click */}
      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}