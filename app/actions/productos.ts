"use server"
import { prisma } from "../../lib/prisma"
import { revalidatePath } from "next/cache"

// Función para CREAR
export async function crearProducto(data: any) {
  await prisma.product.create({
    data: data
  })
  // Esto refresca la tienda y el panel instantáneamente
  revalidatePath('/')
  revalidatePath('/admin')
}

// Función para EDITAR
export async function editarProducto(id: string, data: any) {
  await prisma.product.update({
    where: { id: id },
    data: data
  })
  revalidatePath('/')
  revalidatePath('/admin')
}

// Función para ELIMINAR
export async function eliminarProducto(id: string) {
  await prisma.product.delete({
    where: { id: id }
  })
  revalidatePath('/')
  revalidatePath('/admin')
}