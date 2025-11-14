/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { error } from 'console'
import { success } from 'zod'


export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

    if (data.password.length < 8) {
    return { 
      success: false, 
      error: "Password should be at least 8 character"
    }
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


export async function getUser() {
  const supabase=await createClient();

    const {
    data: { user },
  } = await supabase.auth.getUser()


  if(!user){
    return {succes:false ,user:null}
  }

  return {success:true ,user }
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
        verification_code: "123456",
        phone_verified: false,
      },
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
  // try {
  //   const smsResponse = await fetch(`localhost:3000/api/send-verification-sms`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       phone,
  //       code: verificationCode
  //     })
  //   })

  //   console.log('sms res',smsResponse)

  //   if (!smsResponse.ok) {
  //     console.error('Failed to send SMS')
  //     return {
  //       success: true,
  //       redirectTo: `/verify-phone?phone=${encodeURIComponent(phone)}&sms_error=true`,
  //       warning: 'Account created but SMS failed to send. Please try resending.'
  //     }
  //   }
  // } catch (smsError) {
  //   console.error('SMS sending error:', smsError)
  // }

  return {
    success: true,
    redirectTo: `/verify-phone`
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
        phone_verified: true,
        verification_code: null 
      }
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, message: 'Phone verified successfully' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const smsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-verification-sms/api/send-verification-sms`, {
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
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  })


  console.log('error google',error)
  console.log('data google',data)

  console.log('url',process.env.NEXT_PUBLIC_APP_URL)
  if (error) {
    return { success: false, error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function sendPasswordVerificationEmail(email: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/reset-password`,
  })


  console.log("send email data",data)
  if (error) {
    console.error('Password reset error:', error)
    return { success: false, error: "There was an error sending email try later !" }
  }

  console.log('Password reset email sent successfully')
  return { success: true }
}

export async function updateUserPassword(newPassword:string) {
  const supabase = await createClient()

const { data, error } = await supabase.auth.updateUser({
  password: newPassword
})

console.log('update pass data',data)
console.log('update pass errr',error)


}




// SEND SMS FOR PASSWORD RECOVERY

export async function sendPasswordVerificationSMS(phone: string) {
  try {
    const supabase = await createClient()
    
    // Generate 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Check if user exists with this phone
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .single()
  
console.log("fecth error",fetchError)

    if (fetchError || !profile) {
      return {
        success: false,
        error: "No account found with this phone number"
      }
    }

    // Store verification code and expiry in profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        reset_code: verificationCode,
        reset_code_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        reset_code_used: false
      })
      .eq('phone', phone)

    if (updateError) {
      console.error('[DB Error]:', updateError)
      throw new Error('Failed to store verification code')
    }

    // Send SMS via your API
    const smsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-verification-sms`, {
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
      const error = await smsResponse.json()
      throw new Error(error.message || 'Failed to send SMS')
    }

    console.log(`[SMS] Verification code sent to ${phone}`)
    
    return {
      success: true,
      message: "Verification code sent successfully"
    }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code. Please try again."
    }
  }
}

export async function verifyPasswordResetCode(phone: string, code: string) {
  try {
    const supabase = await createClient()
    
    // Verify the code from profiles table
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .eq('reset_code', code)
      .eq('reset_code_used', false)
      .gt('reset_code_expires_at', new Date().toISOString())
      .single()

    if (fetchError || !profile) {
      return {
        success: false,
        error: "Invalid or expired verification code"
      }
    }
    
    // Generate reset token
    const resetToken = generateResetToken()
    
    // Update profile with reset token and mark code as used
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        reset_code_used: true,
        reset_token: resetToken,
        reset_token_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        reset_token_used: false
      })
      .eq('phone', phone)

    if (updateError) {
      console.error('[DB Error]:', updateError)
      throw new Error('Failed to create reset token')
    }
    
    console.log(`[OTP] Code verified for ${phone}`)
    
    return {
      success: true,
      token: resetToken,
      message: "Code verified successfully"
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: "Failed to verify code. Please try again."
    }
  }
}

function generateResetToken(): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  return `reset_${timestamp}_${randomStr}`
}

// Function to verify reset token on your reset password page
export async function verifyResetToken(token: string, phone: string) {
  try {
    const supabase = await createClient()
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .eq('reset_token', token)
      .eq('reset_token_used', false)
      .gt('reset_token_expires_at', new Date().toISOString())
      .single()

    if (error || !profile) {
      return {
        success: false,
        error: "Invalid or expired reset token"
      }
    }
    
    return {
      success: true,
      userId: profile.id,
      message: "Token is valid"
    }
  } catch (error) {
    console.error("Error verifying reset token:", error)
    return {
      success: false,
      error: "Failed to verify token"
    }
  }
}

// Function to update password and mark token as used
export async function resetPasswordWithToken(token: string, phone: string, newPassword: string) {
  try {
    const supabase = await createClient()
    
    // Verify token first
    const verification = await verifyResetToken(token, phone)
    if (!verification.success) {
      return verification
    }

    // Update password in auth.users
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .single()

    if (!profile) {
      return {
        success: false,
        error: "User not found"
      }
    }

    
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      profile.id,
      { password: newPassword }
    )

    if (passwordError) {
      console.error('[Password Update Error]:', passwordError)
      return {
        success: false,
        error: "Failed to update password"
      }
    }

    // Mark token as used
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        reset_token_used: true,
        // Clear reset fields for security
        reset_code: null,
        reset_token: null
      })
      .eq('phone', phone)

    if (updateError) {
      console.error('[DB Error]:', updateError)
    }
    
    return {
      success: true,
      message: "Password reset successfully"
    }
  } catch (error) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      error: "Failed to reset password. Please try again."
    }
  }
}