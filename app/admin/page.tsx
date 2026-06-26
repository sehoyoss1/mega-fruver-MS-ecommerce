import { prisma } from "../../lib/prisma"
import AddProductButton from "../../components/AddProductButton"
import InventarioClient from "../../components/InventarioClient"
import LogoutButton from "../../components/LogoutButton" 

export default async function AdminDashboard() {
  // 1. Traemos los productos
  const productos = await prisma.product.findMany({
    include: {
      category: true 
    }
  })

  // 2. Traemos las categorías reales de Supabase
  const categorias = await prisma.category.findMany()

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 max-w-7xl mx-auto">
      
      {/* Cabecera del Panel */}
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Panel de Control ⚙️</h1>
          <p className="text-gray-500 font-medium mt-1">Administra tu inventario de Mega Fruver MS.</p>
        </div>
        
        {/* Aquí agrupamos ambos botones en un contenedor flex */}
        <div className="flex items-center gap-3">
          <LogoutButton />
          <AddProductButton categories={categorias} />
        </div>
      </header>

      {/* Aquí inyectamos la tabla interactiva y le pasamos los datos */}
      <InventarioClient productos={productos} categorias={categorias} />
      
    </div>
  )
}