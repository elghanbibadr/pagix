'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'


export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)


  if (error) {
    return { 
      success: false, 
      error: error.message 
    }
  }

  // Check if phone is verified
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('phone_verified, phone')
  //   .eq('id', authData.user.id)
  //   .single()

 

  return { 
    success: true, 
    redirectTo: '/dashboard' 
  }
}

// Generate a random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const { email, password, fullName, confirmPassword, phone } = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    phone: formData.get('phone') as string,
  }

  // Validation
  if (!email || !password || !fullName || !phone) {
    return {
      success: false,
      error: 'Please fill in all required fields'
    }
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match'
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters'
    }
  }

  // Generate verification code
  const verificationCode = generateVerificationCode()

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
        verification_code: verificationCode,
        is_phone_verified: false,
      },
      // Remove email confirmation
      emailRedirectTo: undefined,
    }
  })

  if (error) {
    return {
      success: false,
      error: error.message
    }
  }

  // Send SMS verification code
  try {
    const smsResponse = await fetch(`localhost:3000/api/send-verification-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        code: verificationCode
      })
    })

    console.log('sms res',smsResponse)

    if (!smsResponse.ok) {
      console.error('Failed to send SMS')
      return {
        success: true,
        redirectTo: `/verify-phone?phone=${encodeURIComponent(phone)}&sms_error=true`,
        warning: 'Account created but SMS failed to send. Please try resending.'
      }
    }
  } catch (smsError) {
    console.error('SMS sending error:', smsError)
  }

  return {
    success: true,
    redirectTo: `/verify-phone?phone=${encodeURIComponent(phone)}`
  }
}

export async function verifyPhoneCode(code: string) {
  const supabase = await createClient()

  try {
    // Get current user
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { success: false, error: 'User not found. Please log in.' }
    }

    // Check if code matches
    const storedCode = user.user_metadata?.verification_code

    if (!storedCode) {
      return { success: false, error: 'No verification code found. Please request a new one.' }
    }

    if (storedCode !== code) {
      return { success: false, error: 'Invalid verification code' }
    }

    // Update user metadata to mark phone as verified
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        is_phone_verified: true,
        verification_code: null // Clear the code after verification
      }
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, message: 'Phone verified successfully' }

  } catch (error: any) {
    console.error('Verification error:', error)
    return { success: false, error: error.message || 'Something went wrong' }
  }
}

export async function resendVerificationCode(phone: string) {
  const supabase = await createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { success: false, error: 'User not found' }
    }

    // Generate new code
    const verificationCode = generateVerificationCode()

    // Update user with new code
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        verification_code: verificationCode
      }
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Send SMS
    const smsResponse = await fetch(`localhost:3000/api/send-verification-sms/api/send-verification-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        code: verificationCode
      })
    })

    if (!smsResponse.ok) {
      return { success: false, error: 'Failed to send SMS' }
    }

    return { success: true, message: 'Verification code resent successfully' }

  } catch (error: any) {
    console.error('Resend error:', error)
    return { success: false, error: error.message || 'Something went wrong' }
  }
}
export async function logout() {
  const supabase = await createClient()


  const { error } = await supabase.auth.signOut()


  if (error) {
    console.error("Logout failed:", error)
    redirect('/error')
  }

  
  // Redirect to home or login page
  redirect('/login')
}

export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}