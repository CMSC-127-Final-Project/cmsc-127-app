import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { supabase } from './lib/supabase';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  try {
    if (request.cookies.has('access_token')) {
      const accessToken = request.cookies.get('access_token')?.value;
      const refreshToken = request.cookies.get('refresh_token')?.value;

      if (!accessToken || !refreshToken) {
        throw new Error('Missing tokens in cookies');
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.next();
    } else {
      throw new Error('No access token found');
    }
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/homepage', '/'],
};
