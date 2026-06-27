"use client"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useCartStore } from "../store/cartStore"

export default function CartModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore()
  
  const [mounted, setMounted] = useState(false)

  const [terminosAceptados, setTerminosAceptados] = useState(false)
  const [nombre, setNombre] = useState("")
  const [celular, setCelular] = useState("")
  const [direccion, setDireccion] = useState("")
  const [barrio, setBarrio] = useState("")
  const [nota, setNota] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formularioValido = 
    nombre.trim() !== "" && 
    celular.trim() !== "" && 
    direccion.trim() !== "" && 
    barrio.trim() !== "" && 
    terminosAceptados;

  const enviarPedidoWhatsApp = async () => {
    if (items.length === 0 || !formularioValido || isSubmitting) return

    setIsSubmitting(true)

    try {
      const direccionCompleta = `${direccion} (Barrio: ${barrio}) ${nota ? `- Nota: ${nota}` : ''}`

      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: nombre,
          customerPhone: celular,
          customerAddress: direccionCompleta,
          items: items, 
          total: total
        }),
      })

      if (!response.ok) {
        throw new Error('Error guardando en la base de datos')
      }

      const telefonoVentas = "573013459187"
      let mensaje = "👋 ¡Hola Mega Fruver! Quisiera realizar el siguiente pedido:\n\n"
      items.forEach((item) => {
        mensaje += `🛒 ${item.quantity} ${item.unit} de *${item.name}* ($${item.price * item.quantity})\n`
      })
      mensaje += `\n💰 *Total aproximado: $${total}*\n`
      mensaje += "_(Entiendo que el precio puede variar ligeramente por el peso y que el domicilio se confirmará ahora)._\n\n"
      
      mensaje += `📍 *DATOS DE ENVÍO:*\n`
      mensaje += `*Nombre:* ${nombre}\n`
      mensaje += `*Celular:* ${celular}\n`
      mensaje += `*Dirección:* ${direccion} (Barrio: ${barrio})\n`
      if (nota) mensaje += `*Nota:* ${nota}\n`

      const url = `https://wa.me/${telefonoVentas}?text=${encodeURIComponent(mensaje)}`
      window.open(url, '_blank')
      
    } catch (error) {
      console.error("Error al procesar el pedido:", error)
      alert("Hubo un pequeño error procesando tu pedido, por favor intenta darle a Enviar de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity" style={{ zIndex: 99999 }}>
      <div className="bg-white w-full max-w-lg rounded-[2rem] p-5 md:p-8 shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Tu Pedido 🛒</h2>
          <button onClick={clearCart} className="text-sm text-red-500 font-bold hover:bg-red-50 py-1.5 px-3 rounded-xl transition-colors">
            Vaciar carrito
          </button>
        </div>
        
        <div className="overflow-y-auto pr-2 mb-4 flex-grow custom-scrollbar space-y-5">
          
          <div className="space-y-3">
            {items.length === 0 && (
              <p className="text-center text-gray-400 font-medium py-4">Tu carrito está vacío</p>
            )}
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3.5 rounded-2xl border border-gray-100 gap-3">
                <div className="flex-1">
                  <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">{item.unit}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 0.5)} className="w-8 h-8 font-black text-gray-600 hover:text-mf-green transition-colors">-</button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 0.5)} className="w-8 h-8 font-black text-gray-600 hover:text-mf-green transition-colors">+</button>
                  </div>
                  
                  <span className="font-black text-gray-900 w-16 text-right">${item.price * item.quantity}</span>
                  
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 text-2xl font-black transition-colors">
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
              <h3 className="font-black text-gray-800 uppercase tracking-wider text-xs border-b border-gray-200 pb-2">📍 Datos de entrega</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Nombre</label>
                  <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Sergio..." className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-mf-green outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Celular</label>
                  <input type="tel" required value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="Ej: 300..." className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-mf-green outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Dirección</label>
                  <input type="text" required value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Ej: Cll 47 # 20-15" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-mf-green outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Barrio</label>
                  <input type="text" required value={barrio} onChange={(e) => setBarrio(e.target.value)} placeholder="Ej: Las Mercedes" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-mf-green outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Nota (Opcional)</label>
                <input type="text" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej: Traer devuelta de 50.000" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-mf-green outline-none transition-all" />
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className={`p-4 rounded-3xl border-2 transition-all duration-300 mt-2 ${
              terminosAceptados 
                ? "bg-mf-light/50 border-mf-green shadow-[0_0_15px_rgba(34,197,94,0.15)]" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => setTerminosAceptados(!terminosAceptados)}>
                <span className={`font-bold transition-colors ${terminosAceptados ? "text-mf-green" : "text-gray-700"}`}>
                  Aceptar condiciones del servicio
                </span>
                <div className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${terminosAceptados ? 'bg-mf-green' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${terminosAceptados ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${terminosAceptados ? "bg-green-100" : "bg-gray-200"}`}>⚖️</div>
                  <p className="text-xs text-gray-600 leading-tight">El precio varía <strong className="text-gray-900">+/- 1000 COP</strong> por peso exacto.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${terminosAceptados ? "bg-green-100" : "bg-gray-200"}`}>🛵</div>
                  <p className="text-xs text-gray-600 leading-tight">El domicilio se confirmará directamente contigo.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${terminosAceptados ? "bg-green-100" : "bg-gray-200"}`}>⏱️</div>
                  <p className="text-xs text-gray-600 leading-tight">Entrega estimada entre <strong className="text-gray-900">30 a 90 minutos</strong>.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 mt-auto bg-white pt-2">
          <div className="flex justify-between items-end border-t border-gray-100 pt-4 mb-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total aprox.</span>
            <span className="text-4xl font-black text-mf-green leading-none">${total}</span>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={enviarPedidoWhatsApp}
              disabled={items.length === 0 || !formularioValido || isSubmitting}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                formularioValido 
                  ? "bg-mf-green text-white hover:bg-green-600 active:scale-95 shadow-lg shadow-green-200" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Procesando... ⏳" : formularioValido ? "Enviar pedido a WhatsApp 🚀" : "Llena los datos para continuar"}
            </button>
            
            <button onClick={onClose} className="w-full text-gray-400 font-bold hover:text-gray-600 hover:bg-gray-50 py-3 rounded-xl transition-all">
              Cerrar
            </button>
          </div>
        </div>
        
      </div>
    </div>,
    document.body
  )
}