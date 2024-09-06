import { NextResponse } from 'next/server';

export async function middleware(request) {
  const sessionToken = request.cookies.get('__Secure-next-auth.session-token') || request.cookies.get('next-auth.session-token');

if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
return
}

export const config = {
  matcher: '/home/:path*',
};
