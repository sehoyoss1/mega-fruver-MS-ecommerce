"use client"
import { useState } from "react"
import ProductModal from "./ProductModal"
import { eliminarProducto } from "../app/actions/productos"

// --- BOTÓN DE ELIMINAR ---
export function DeleteProductButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm("⚠️ ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
      await eliminarProducto(id)
    }
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
      Eliminar
    </button>
  )
}

// --- BOTÓN DE EDITAR ---
export function EditProductButton({ product, categories }: any) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-blue-500 hover:text-blue-700 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
        Editar
      </button>
      
      {/* Al darle a editar, abrimos el mismo Modal, pero le pasamos los datos del producto */}
      <ProductModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        categories={categories} 
        productoAEditar={product} 
      />
    </>
  )
}