import { prisma } from "../../../lib/prisma"
import PedidoCard from "../../../components/PedidoCard" // Importamos la nueva tarjeta viva
import LogoutButton from "../../../components/LogoutButton" // <-- 1. Importamos el botón de salir
export const dynamic = 'force-dynamic';

export default async function PedidosPage() {
  const hace90Minutos = new Date(Date.now() - 90 * 60 * 1000)

  // Traemos los pedidos, incluyendo los productos y sus nombres
  const pedidos = await prisma.order.findMany({
    where: {
      status: { 
        notIn: ["DELIVERED", "CANCELLED"] 
      },
      createdAt: { gte: hace90Minutos } 
    },
    orderBy: { createdAt: 'asc' }, // Cambiamos a 'asc' para que el más viejo (el que hay que despachar ya) salga de primero
    include: {
      items: {
        include: {
          product: true // Esto nos trae el nombre del producto de la otra tabla
        }
      }
    }
  })

  return (
    <main className="p-4 md:p-6 bg-gray-50 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">📦 Tablero de Pedidos</h1>
        
        {/* <-- 2. Agrupamos el letrero y el botón de salir --> */}
        <div className="flex items-center gap-3">
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-sm">
            ⏱️ Auto-limpieza individual: 90 min
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {pedidos.map((pedido) => (
          // Cada pedido renderiza su propio componente con su reloj independiente
          <PedidoCard key={pedido.id} pedido={pedido} />
        ))}
      </div>

      {pedidos.length === 0 && (
        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 mt-8">
          <span className="text-6xl grayscale opacity-30 mb-4 block">🍎</span>
          <h3 className="text-xl font-bold text-gray-800">Cero pedidos pendientes</h3>
          <p className="text-gray-400 font-medium mt-1">El tablero está limpio por ahora.</p>
        </div>
      )}
    </main>
  )
}