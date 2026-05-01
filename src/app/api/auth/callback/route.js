import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new NextResponse(`Error from Google: ${error}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse('No code provided', { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  const isProd = process.env.NODE_ENV === 'production';
  const baseUrl = isProd ? 'https://pokedex-lite-rose.vercel.app' : 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/callback`;

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new NextResponse(`Token error: ${tokenData.error_description || tokenData.error}`, { status: 400 });
    }

    // 2. Fetch user profile using access token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // 3. Return an HTML script that saves the user to localStorage and redirects
    const html = `
      <html>
        <body>
          <script>
            const user = {
              name: ${JSON.stringify(userData.name)},
              email: ${JSON.stringify(userData.email)},
              image: ${JSON.stringify(userData.picture)}
            };
            localStorage.setItem('pokedex-user', JSON.stringify(user));
            window.location.href = '/';
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (err) {
    console.error('OAuth Callback Error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
