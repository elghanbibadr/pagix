import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { routing } from '@/i18n/routing'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const locale = searchParams.get('locale') ?? routing.defaultLocale



  // Check if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/dashboard'
  
  // Only allow relative URLs
  if (!next.startsWith('/')) {
    next = '/dashboard'
  }

  // Ensure the redirect URL includes the locale prefix
  const localizedNext = next.startsWith(`/${locale}`) 
    ? next 
    : `/${locale}${next}`


  if (code) {

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    
    if (!error) {
      return NextResponse.redirect(`${origin}${localizedNext}`)
    }
  }

  // Return the user to an error page with instructions
  const localizedError = `/${locale}/auth/auth-code-error`
  return NextResponse.redirect(`${origin}${localizedError}`)
}