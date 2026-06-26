"use client"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    // 1. Llamamos a nuestra nueva ruta para destruir la cookie
    await fetch('/api/logout', { method: 'POST' })
    
    // 2. Refrescamos y mandamos al usuario de vuelta a la tienda
    router.refresh()
    router.push('/')
  }

  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
      title="Cerrar Sesión"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      Salir
    </button>
  )
}