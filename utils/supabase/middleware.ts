import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

function getLocaleInfo(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  const hasLocale = routing.locales.includes(firstSegment as any)
  const locale = hasLocale ? firstSegment : routing.defaultLocale
  const pathWithoutLocale = hasLocale 
    ? '/' + segments.slice(1).join('/') 
    : pathname

  return { locale, pathWithoutLocale, hasLocale }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { locale, pathWithoutLocale } = getLocaleInfo(request.nextUrl.pathname)

  // Skip auth check for API routes and auth callback
  if (
    pathWithoutLocale.startsWith('/api') || 
    pathWithoutLocale.startsWith('/auth/callback') ||
    request.nextUrl.pathname.startsWith('/api') || 
    request.nextUrl.pathname.startsWith('/auth/callback')
  ) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const authRoutes = ['/login', '/signup']
  const publicRoutes = [
    '/',
    '/verify-phone',
    '/email-confirmation', 
    '/update-password',
    '/error',
    '/reset-password',
    '/auth/callback',  // Add this
    '/auth/auth-code-error',  // Add this
    ...authRoutes
  ]

  const isAuthRoute = authRoutes.some(route => 
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
  )

  const isPublicRoute = publicRoutes.some(route => 
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
  )

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (user && isAuthRoute) {
    console.log("if is users", user)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  // If no user and trying to access protected routes, redirect to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}