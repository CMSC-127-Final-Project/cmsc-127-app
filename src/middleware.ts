import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Allow access to login and API routes without redirection
    if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    if (request.cookies.has('access_token')) {
      const accessToken = request.cookies.get('access_token')?.value;
      const refreshToken = request.cookies.get('refresh_token')?.value;

      if (!accessToken || !refreshToken) {
        console.warn('Missing tokens in cookies');
        return redirectToLogin(request);
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        console.error('Supabase session error:', error);

        // Clear cookies if the refresh token is invalid or already used
        if (error.code === 'refresh_token_already_used') {
          return redirectToLogin(request, true);
        }

        return redirectToLogin(request);
      }

      return NextResponse.next();
    } else {
      console.warn('No access token found');
      return redirectToLogin(request);
    }
  } catch (error) {
    console.error('Middleware error:', error);

    // Prevent infinite redirects by ensuring we don't redirect if already on /login
    if (request.nextUrl.pathname !== '/login') {
      return redirectToLogin(request);
    }

    return NextResponse.next();
  }
}

function redirectToLogin(request: NextRequest, clearCookies = false) {
  const response = NextResponse.redirect(new URL('/login', request.url));

  if (clearCookies) {
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
  }

  return response;
}

export const config = {
  matcher: ['/homepage', '/'],
};
