import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const sessionToken = 
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  const isLoginPage = req.nextUrl.pathname === '/login';

  if (!sessionToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (sessionToken && isLoginPage) {
    return NextResponse.redirect(new URL('/auditoria', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auditoria/:path*', '/login'],
};