"use client"
import { useState } from "react"
import { crearProducto, editarProducto } from "../app/actions/productos"
import { supabase } from "../lib/supabase"

export default function ProductModal({ isOpen, onClose, categories = [], productoAEditar = null }: any) {
  const [nombre, setNombre] = useState(productoAEditar?.name || "")
  const [precio, setPrecio] = useState(productoAEditar?.price || "")
  const [unidad, setUnidad] = useState(productoAEditar?.measureUnit || "POUND")
  const [categoryId, setCategoryId] = useState(productoAEditar?.categoryId || "") // <-- Guardamos el ID, no el texto
  const [esOferta, setEsOferta] = useState(productoAEditar?.isOffer || false)
  const [foto, setFoto] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = productoAEditar?.image || ""

      // 1. SI HAY UNA FOTO NUEVA, LA SUBIMOS PRIMERO
      if (foto) {
        // Le inventamos un nombre único a la foto para que no se sobreescriban
        const fileExt = foto.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`

        // Subimos al bucket "productos"
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('productos')
          .upload(fileName, foto)

        if (uploadError) {
          throw new Error("Error subiendo la foto: " + uploadError.message)
        }

        // Pedimos el link público de la foto que acabamos de subir
        const { data: publicUrlData } = supabase.storage
          .from('productos')
          .getPublicUrl(fileName)

        imageUrl = publicUrlData.publicUrl
      }

      // 2. ARMAMOS EL PAQUETE CON EL LINK DE LA FOTO REAL
      const paqueteDatos = {
        name: nombre,
        price: parseFloat(precio),
        measureUnit: unidad,
        categoryId: categoryId,
        isOffer: esOferta,
        isAvailable: true,
        image: imageUrl // <--- ¡AQUÍ ESTÁ LA MAGIA!
      }

      // 3. GUARDAMOS EN PRISMA
      if (productoAEditar) {
        await editarProducto(productoAEditar.id, paqueteDatos)
      } else {
        await crearProducto(paqueteDatos)
      }

      onClose()
    } catch (error) {
      console.error(error)
      alert("Hubo un error guardando el producto. Revisa la consola.")
    } finally {
      setIsLoading(false)
    }
  }

  // Iconos dinámicos para que el admin identifique visualmente el tipo en el selector
  const getIcon = (name: string) => {
    if (name.includes("Fruta")) return "🍎 "
    if (name.includes("Verdura")) return "🥦 "
    if (name.includes("Hierba")) return "🌿 "
    if (name.includes("Grano")) return "🌾 "
    return "🏪 "
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {productoAEditar ? "✏️ Editar Producto" : "📦 Nuevo Producto"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-xl transition-colors">×</button>
        </div>

        <form onSubmit={guardarProducto} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre del producto</label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Tomate Chonto" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-mf-green focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Precio</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
                <input 
                  type="number" 
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-8 pr-4 py-3 font-bold focus:ring-2 focus:ring-mf-green focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Se vende por</label>
              <select 
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-mf-green focus:border-transparent outline-none cursor-pointer appearance-none"
              >
                <option value="POUND">Libra</option>
                <option value="KILO">Kilo</option>
                <option value="UNIT">Unidad</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-mf-green focus:border-transparent outline-none cursor-pointer appearance-none"
                required
              >
                <option value="" disabled>Selecciona una categoría...</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {getIcon(cat.name)}{cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Foto del Producto</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📸</div>
              <p className="text-sm font-medium text-gray-600">
                {foto ? <span className="text-mf-green font-bold">{foto.name}</span> : "Toca aquí o arrastra la foto real"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-orange-50/50 border border-orange-100 p-4 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 text-sm">¿Es oferta del día?</p>
              <p className="text-xs text-gray-500 mt-0.5">Aparecerá destacado en rojo en la tienda.</p>
            </div>
            <div className="cursor-pointer" onClick={() => setEsOferta(!esOferta)}>
              <div className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${esOferta ? 'bg-orange-500' : 'bg-gray-300'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${esOferta ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="w-1/3 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="w-2/3 bg-mf-green text-white font-bold py-3.5 rounded-xl hover:bg-green-600 shadow-lg shadow-green-200 active:scale-95 transition-all">
              {productoAEditar ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}