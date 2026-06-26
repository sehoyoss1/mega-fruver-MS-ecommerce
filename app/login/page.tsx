"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // 1. Llamamos a la API que creaste
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      // 2. Si hay error (contraseña mal, etc), lo mostramos
      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión")
        setIsLoading(false)
        return
      }

      // 3. Si todo sale bien, redirigimos según el rol
      if (data.role === "ADMIN") {
        router.push("/admin") // Tú vas al inventario total
      } else {
        router.push("/admin/pedidos") // Los empleados van directo a despachar
      }
      
    } catch (err) {
      setError("Error de conexión con el servidor")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-xl border border-gray-100">
        
        {/* LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900">
            MegaFruver<span className="text-mf-green">MS</span><span className="text-mf-green text-4xl leading-none">.</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Panel de Administración</p>
        </div>

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Usuario
            </label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: admin"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-mf-green focus:bg-white outline-none transition-all font-medium text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Contraseña
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-mf-green focus:bg-white outline-none transition-all font-medium text-gray-800"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-mf-green text-white font-black py-4 rounded-xl mt-4 hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            {isLoading ? "Validando..." : "Ingresar al Panel 🔒"}
          </button>
        </form>

      </div>
    </main>
  )
}