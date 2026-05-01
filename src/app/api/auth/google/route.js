import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const isProd = process.env.NODE_ENV === 'production';
  const baseUrl = isProd ? 'https://pokedex-lite-rose.vercel.app' : 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/callback`;
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
    return NextResponse.json({ error: 'Missing GOOGLE_CLIENT_ID in .env.local' }, { status: 500 });
  }

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'openid email profile');
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');

  return NextResponse.redirect(authUrl.toString());
}
