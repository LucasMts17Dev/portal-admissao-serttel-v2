import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const sessionToken =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  const isLoginPage = req.nextUrl.pathname === '/login';

  if (!sessionToken && !isLoginPage) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionToken && isLoginPage) {
    // 🔧 CORREÇÃO: respeita o destino original (?from=) em vez de forçar /auditoria.
    // Isso evita que um usuário já autenticado que caia em /login (ex: clicou em
    // "Sou DP" com sessão ativa) seja sequestrado para a tela do Gestor.
    const from = req.nextUrl.searchParams.get('from');
    const destino = from && from.startsWith('/') ? from : '/auditoria';
    return NextResponse.redirect(new URL(destino, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auditoria/:path*', '/dp/:path*', '/login'],
};
