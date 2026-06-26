import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
}

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (item: Omit<CartItem, 'quantity'>, cantidadDeseada: number) => void
  removeItem: (id: string) => void // Nueva función para eliminar
  updateQuantity: (id: string, newQuantity: number) => void // Nueva función para editar
  clearCart: () => void // Nueva función para vaciar todo
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  addItem: (newItem, cantidadDeseada) => set((state) => {
    const existingItem = state.items.find((item) => item.id === newItem.id)
    let updatedItems;
    if (existingItem) {
      updatedItems = state.items.map((item) =>
        item.id === newItem.id ? { ...item, quantity: item.quantity + cantidadDeseada } : item
      )
    } else {
      updatedItems = [...state.items, { ...newItem, quantity: cantidadDeseada }]
    }
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return { items: updatedItems, total: newTotal }
  }),
  
  // Lógica para borrar un producto
  removeItem: (id) => set((state) => {
    const updatedItems = state.items.filter(item => item.id !== id)
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return { items: updatedItems, total: newTotal }
  }),

  // Lógica para sumar o restar desde el resumen
  updateQuantity: (id, newQuantity) => set((state) => {
    if (newQuantity < 0.5) return state; // No permite bajar de 0.5
    const updatedItems = state.items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return { items: updatedItems, total: newTotal }
  }),

  // Lógica para el botón del pánico (borrar todo)
  clearCart: () => set({ items: [], total: 0 })
}))