import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "../../../lib/prisma"

export async function POST(request: Request) {
  try {
    // 1. Recibimos lo que el usuario escribió en el formulario
    const body = await request.json()
    const { username, password } = body

    // 2. Buscamos al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })

    // 3. Verificamos si existe y si la contraseña coincide
    // (Nota: Como guardamos "tu_clave_segura" en texto plano con el seed, la comparamos igual)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      )
    }

    // 4. CREAMOS EL TÍQUET VIP (La Cookie)
    // Guardamos qué rol tiene (ADMIN o EMPLOYEE) para saber a qué pantallas dejarlo entrar
    const sessionData = JSON.stringify({ 
      id: user.id, 
      role: user.role,
      username: user.username 
    })

    // 5. Le inyectamos la cookie al navegador de forma segura
    // Usamos await cookies() porque en las versiones recientes de Next.js esto es una promesa
    const cookieStore = await cookies()
    cookieStore.set('mega_session', sessionData, {
      httpOnly: true, // Seguridad extrema: Evita que hackers lean la cookie con JavaScript
      secure: process.env.NODE_ENV === 'production', // En producción exige HTTPS
      maxAge: 60 * 60 * 24, // El tíquet dura 1 día entero (24 horas)
      path: '/', // Válido en toda la página
    })

    // 6. Damos luz verde
    return NextResponse.json({ 
      success: true, 
      role: user.role 
    })

  } catch (error) {
    console.error("Error en el login:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}