import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function POST(request: Request) {
  try {
    // 1. Recibimos los datos que envía el carrito
    const body = await request.json()
    const { customerName, customerPhone, customerAddress, items, total } = body

    // 2. Guardamos el pedido en la base de datos de Prisma
    const nuevoPedido = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        total,
        // Magia de Prisma: Guarda el pedido y sus productos al mismo tiempo
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    // 3. Devolvemos una respuesta de éxito
    return NextResponse.json({ success: true, pedido: nuevoPedido })
    
  } catch (error) {
    console.error("Error al guardar el pedido:", error)
    return NextResponse.json(
      { success: false, error: "Hubo un error guardando el pedido en la base de datos" }, 
      { status: 500 }
    )
  }
}