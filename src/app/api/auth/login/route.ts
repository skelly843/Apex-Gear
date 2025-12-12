import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || 'a-secure-default-secret';

if (!ADMIN_PASSWORD) {
  console.warn(
    'ADMIN_PASSWORD is not set. Using a default password: "password".'
  );
}

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === (ADMIN_PASSWORD || 'password')) {
    // Create a JWT token
    const token = sign({ admin: true }, JWT_SECRET, { expiresIn: '8h' });

    // Set the token in a secure, http-only cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    });
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
