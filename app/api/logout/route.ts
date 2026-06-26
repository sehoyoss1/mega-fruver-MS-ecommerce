import { NextResponse } from "next/server"

export async function POST() {
  // Preparamos la respuesta de éxito
  const response = NextResponse.json({ success: true, message: "Sesión cerrada" })
  
  // Destruimos la cookie "mega_session" poniéndole fecha de expiración en el pasado
  response.cookies.set({
    name: 'mega_session',
    value: '',
    expires: new Date(0),
    path: '/',
  })

  return response
}