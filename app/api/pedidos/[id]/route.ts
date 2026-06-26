import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

// Usamos PATCH porque solo vamos a "parchar" o actualizar un pedacito del pedido (el estado)
export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    // Extraemos el ID del pedido de la URL
    const { id } = await props.params
    
    // Extraemos el nuevo estado que nos manda el botón
    const body = await request.json()
    const { status } = body

    // Actualizamos en la base de datos
    const pedidoActualizado = await prisma.order.update({
      where: { id: id },
      data: { status: status }
    })

    return NextResponse.json({ success: true, pedido: pedidoActualizado })
    
  } catch (error) {
    console.error("Error al actualizar el estado:", error)
    return NextResponse.json(
      { success: false, error: "Hubo un error actualizando el pedido" }, 
      { status: 500 }
    )
  }
}