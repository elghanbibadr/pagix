import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/verify-phone'

  if (code) {
    const supabase = await createClient()

    console.log("arrived")
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if phone is already verified
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone_verified')
          .eq('id', user.id)
          .single()

        // If phone is verified, go to dashboard
        if (profile?.phone_verified) {
          return NextResponse.redirect(`${origin}/dashboard`)
        }
        
        // Otherwise, go to phone verification
        return NextResponse.redirect(`${origin}/verify-phone`)
      }
    }
  }

  // Return to error page if something went wrong
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}