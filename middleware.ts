import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware'

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware entirely for API routes and auth callbacks
  if (
    pathname.startsWith('/api') ||
    pathname.includes('/api/') ||
    pathname.startsWith('/auth/callback') ||
    pathname.includes('/auth/callback')
  ) {
    return NextResponse.next();
  }

  // Step 1: Handle internationalization first
  const intlResponse = intlMiddleware(request);
  
  // Step 2: Handle Supabase session
  const supabaseResponse = await updateSession(request);
  
  // Step 3: Merge responses - preserve intl headers/cookies
  if (intlResponse instanceof NextResponse) {
    // Copy important headers from intl response to supabase response
    intlResponse.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('x-') || key === 'set-cookie') {
        supabaseResponse.headers.set(key, value);
      }
    });

    // If intl middleware wants to redirect, respect that
    if (intlResponse.status === 307 || intlResponse.status === 308) {
      return intlResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}