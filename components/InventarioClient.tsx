"use client"
import { useState } from "react"
import { EditProductButton, DeleteProductButton } from "./AdminButtons" // Ajusta la ruta si es necesario

export default function InventarioClient({ productos, categorias }: { productos: any[], categorias: any[] }) {
  const [filtroActivo, setFiltroActivo] = useState("Todo")

  // Creamos la lista de botones dinámicamente: "Todo", "Ofertas", y las categorías de tu base de datos
  const botonesMenu = ["Todo", "Ofertas", ...categorias.map((c: any) => c.name)]

  // Filtramos los productos según el botón seleccionado
  const productosFiltrados = productos.filter((prod: any) => {
    if (filtroActivo === "Todo") return true
    if (filtroActivo === "Ofertas") return prod.isOffer === true
    return prod.category?.name === filtroActivo
  })

  // Función para darle color a la etiqueta de categoría en la tabla
  const getColorCategoria = (categoria: string) => {
    switch (categoria?.toLowerCase()) {
      case "verduras": return "bg-green-100 text-green-700 border-green-200"
      case "frutas": return "bg-orange-100 text-orange-700 border-orange-200"
      case "hierbas": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "granos": return "bg-amber-100 text-amber-800 border-amber-200"
      case "tienda": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-gray-100 text-gray-600 border-gray-200" // Por defecto
    }
  }

  return (
    <div>
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 custom-scrollbar items-center">
        {botonesMenu.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroActivo(cat)}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all duration-300 border-2 ${
              filtroActivo === cat
                ? "bg-mf-green text-white border-mf-green shadow-lg shadow-green-200 scale-105"
                : "bg-white text-gray-500 border-gray-100 hover:border-mf-green/30 hover:text-mf-green hover:bg-green-50"
            }`}
          >
            {cat === "Ofertas" ? "🔥 Ofertas" : cat}
          </button>
        ))}
      </div>

      {/* TU TABLA ORIGINAL INTACTA (Solo cambiamos productos.map por productosFiltrados.map) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100">
                <th className="p-5 font-bold">Producto</th>
                <th className="p-5 font-bold">Precio / Unidad</th>
                <th className="p-5 font-bold">Categoría</th>
                <th className="p-5 font-bold">Etiquetas</th>
                <th className="p-5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productosFiltrados.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl overflow-hidden">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          "🛒"
                        )}
                      </div>
                      <span className="font-bold text-gray-800">{prod.name}</span>
                    </div>
                  </td>
                  
                  <td className="p-5 font-bold text-mf-green">
                    ${prod.price} <span className="text-gray-400 text-sm font-medium">/ {prod.measureUnit}</span>
                  </td>
                  
                  <td className="p-5">
                    {/* AQUÍ APLICAMOS EL COLOR DINÁMICO */}
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getColorCategoria(prod.category?.name)}`}>
                      {prod.category?.name || "Sin categoría"}
                    </span>
                  </td>
                  
                  <td className="p-5 flex gap-2">
                    {prod.isOffer && <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">🔥 Oferta</span>}
                    {!prod.isAvailable && <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">Agotado</span>}
                  </td>
                  
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <EditProductButton product={prod} categories={categorias} />
                      <DeleteProductButton id={prod.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {/* Mensaje por si una categoría está vacía */}
              {productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-gray-500 font-medium text-lg">No hay productos en esta sección</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}