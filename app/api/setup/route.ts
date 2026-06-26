import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function GET() {
  try {
    // 1. INYECTAR CATEGORÍAS (Tu código actual)
    const categoriasOficiales = ["Frutas", "Verduras", "Hierbas", "Granos", "Tienda"]
    let creadas = 0;

    for (const nombre of categoriasOficiales) {
      const existe = await prisma.category.findFirst({
        where: { name: nombre }
      })

      if (!existe) {
        await prisma.category.create({
          data: { name: nombre }
        })
        creadas++;
      }
    }

    // 2. INYECTAR USUARIO ADMINISTRADOR (Lo nuevo)
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {}, // Si ya existe, no le hace ningún cambio
      create: {
        username: 'admin',
        password: 'tu_clave_segura', // Esta será tu contraseña temporal para probar
        role: 'ADMIN',
      },
    })

    // 3. RESPUESTA COMPLETA
    return NextResponse.json({ 
      success: true,
      mensaje: "¡Éxito! Base de datos configurada por completo.", 
      categoriasNuevas: creadas,
      adminListo: adminUser.username
    })

  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ 
      success: false,
      error: "Hubo un error configurando los datos iniciales",
      detalles: error.message 
    }, { status: 500 })
  }
}