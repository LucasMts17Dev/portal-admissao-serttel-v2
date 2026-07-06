import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isAuth = !!token;
  const isLoginPage = req.nextUrl.pathname === '/login';

  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL('/auditoria', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auditoria/:path*', '/login'],
};