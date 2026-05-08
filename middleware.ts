import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

const guestOnlyRoutes = [
  '/auth/signin',
  '/auth/signup'
];

const authOnlyRoutes = [
  '/'
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthPage = guestOnlyRoutes.some(
    route => pathname.startsWith(route)
  );

  const isProtectedPage = authOnlyRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedPage && !token) {
    const loginUrl = new URL('/auth/signin', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*']
}