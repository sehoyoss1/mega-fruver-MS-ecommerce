"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PedidoCard({ pedido }: { pedido: any }) {
  const router = useRouter()
  
  // Estados de tiempo
  const [minutosRestantes, setMinutosRestantes] = useState(90)
  const [porcentaje, setPorcentaje] = useState(0)
  
  // Solución al error de Hidratación
  const [isMounted, setIsMounted] = useState(false)
  
  // Estado para bloquear los botones mientras carga
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setIsMounted(true) // Le decimos a React que ya estamos en el navegador

    const calcularTiempo = () => {
      const tiempoCreacion = new Date(pedido.createdAt).getTime()
      const tiempoActual = Date.now()
      const minutosTranscurridos = Math.floor((tiempoActual - tiempoCreacion) / 60000)
      const restantes = Math.max(0, 90 - minutosTranscurridos)
      
      setMinutosRestantes(restantes)
      setPorcentaje(Math.min(100, (minutosTranscurridos / 90) * 100))
    }

    calcularTiempo()
    const intervalo = setInterval(calcularTiempo, 60000)
    return () => clearInterval(intervalo)
  }, [pedido.createdAt])

  // FUNCIÓN PARA ACTUALIZAR EL ESTADO
  const cambiarEstado = async (nuevoEstado: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/pedidos/${pedido.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nuevoEstado }),
      })

      if (response.ok) {
        // Magia pura: Le decimos a Next.js que refresque el tablero silenciosamente
        router.refresh()
      } else {
        alert("Error al actualizar el pedido")
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión al actualizar")
    } finally {
      setIsUpdating(false)
    }
  }

  // Formatear la hora en la que entró el pedido
  const horaLlegada = isMounted 
    ? new Date(pedido.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute:'2-digit' })
    : "..." // Mientras carga, muestra unos puntitos para que no haya error de hidratación

  // Evaluamos si el pedido ya lo están preparando para cambiar el color de la tarjeta
  const estaPreparando = pedido.status === "PREPARING"

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col h-full transition-all duration-500 border-2 ${
      estaPreparando ? "border-blue-300 shadow-blue-100" : "border-gray-100"
    }`}>
      
      <div 
        className={`absolute top-0 left-0 h-1.5 transition-all duration-1000 ${minutosRestantes < 15 ? 'bg-red-500' : 'bg-orange-400'}`} 
        style={{ width: `${porcentaje}%` }}
      ></div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-black text-white font-black text-sm px-2 py-0.5 rounded-md">
              #{pedido.orderNumber}
            </span>
            <span className="text-xs font-bold text-gray-400">
              Llegó a las {horaLlegada}
            </span>
          </div>
          <h3 className="font-black text-xl text-gray-900 leading-tight">{pedido.customerName}</h3>
          <p className="text-sm font-medium text-mf-green mt-1">📞 {pedido.customerPhone}</p>
        </div>
        
        <span className={`text-[10px] font-black px-2 py-1.5 rounded-md shadow-sm shrink-0 ml-2 ${
          minutosRestantes < 15 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-orange-100 text-orange-700'
        }`}>
          {minutosRestantes > 0 ? `${minutosRestantes} MIN` : 'EXPIRADO'}
        </span>
      </div>

      <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex-grow border border-gray-100">
        <p className="text-sm font-medium text-gray-600 italic mb-3 pb-3 border-b border-gray-200">
          📍 {pedido.customerAddress}
        </p>
        
        <div className="space-y-2 mb-3">
          {pedido.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">
                <span className="font-black text-gray-900 mr-1">{item.quantity}x</span> 
                {item.product?.name || 'Producto eliminado'}
              </span>
              <span className="text-gray-500 font-bold">${item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-auto">
          <span className="text-xs font-bold text-gray-400 uppercase">Total:</span>
          <span className="text-lg font-black text-gray-900">${pedido.total}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto shrink-0">
        {/* Botón de PREPARANDO (Solo funciona si el pedido está en PENDIENTE) */}
        <button 
          onClick={() => cambiarEstado("PREPARING")}
          disabled={isUpdating || estaPreparando}
          className={`font-bold py-3 rounded-xl text-xs transition-colors border ${
            estaPreparando 
              ? "bg-blue-100 text-blue-400 border-blue-200 cursor-not-allowed" 
              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          }`}
        >
          {estaPreparando ? "EN PROCESO 👨‍🍳" : "PREPARAR"}
        </button>

        {/* Botón de TERMINAR (Manda a DELIVERED y desaparece del tablero) */}
        <button 
          onClick={() => cambiarEstado("DELIVERED")}
          disabled={isUpdating}
          className="bg-mf-green text-white font-black py-3 rounded-xl text-xs hover:bg-green-600 transition-colors shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "..." : "TERMINAR"}
        </button>
      </div>
    </div>
  )
}