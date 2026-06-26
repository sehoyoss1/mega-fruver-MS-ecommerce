import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const session = request.cookies.get('mega_session')
  const { pathname } = request.nextUrl

  // CASO 1: Intentan entrar a la zona de administración
  if (pathname.startsWith('/admin')) {
    // Si no hay sesión, pa' fuera
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const userData = JSON.parse(session.value)
      
      // LA NUEVA REGLA: Si NO es ADMIN e intenta entrar a "/admin" (Inventario)
      if (userData.role !== 'ADMIN' && pathname === '/admin') {
        // Lo devolvemos a su zona permitida (Pedidos)
        return NextResponse.redirect(new URL('/admin/pedidos', request.url))
      }
    } catch (e) {
      // Si la cookie está rara, al login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // CASO 2: Ya logueados intentan ver el Login
  if (pathname.startsWith('/login')) {
    if (session) {
      try {
        const userData = JSON.parse(session.value)
        if (userData.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else {
          return NextResponse.redirect(new URL('/admin/pedidos', request.url))
        }
      } catch (e) {}
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}