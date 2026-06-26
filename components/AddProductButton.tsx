"use client"
import { useState } from "react"
import ProductModal from "./ProductModal"

export default function AddProductButton({ categories }: { categories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95"
      >
        + Nuevo Producto
      </button>
      
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories} // <-- Pasamos las categorías al modal
      />
    </>
  )
}