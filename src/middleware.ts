import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register'];

// List of auth routes that should redirect to home if user is authenticated
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Debug logging
  console.log('Middleware executing for path:', pathname);
  console.log('Cookies:', request.cookies.getAll());
  
  // Check if the user has an access token cookie
  const hasAccessToken = request.cookies.has('access_token');
  console.log('Has access token:', hasAccessToken);
  
  // If trying to access auth routes while logged in, redirect to home
  if (authRoutes.includes(pathname) && hasAccessToken) {
    console.log('Redirecting to home - authenticated user on auth route');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access protected routes while logged out, redirect to login
  if (!publicRoutes.includes(pathname) && !hasAccessToken) {
    console.log('Redirecting to login - unauthenticated user on protected route');
    // Store the original URL to redirect back after login
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  console.log('Middleware allowing request to continue');
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 