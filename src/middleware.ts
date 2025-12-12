import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'a-secure-default-secret';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Allow login page and auth API to be accessed without a token
  if (request.nextUrl.pathname.startsWith('/admin/login') || request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'], // Protect all admin pages and admin-specific APIs
};
