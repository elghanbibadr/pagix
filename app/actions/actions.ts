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

export async function signup(formData: FormData) {
  const supabase = await createClient()

  console.log("triggering sign up")
  console.log("form data", formData)

  const { email, password, fullName, confirmPassword } = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  // Validation
  if (!email || !password || !fullName) {
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

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    }
  })

  console.log("error", error)
  console.log('sign up data', authData)

  if (error) {
    return {
      success: false,
      error: error.message
    }
  }

  
  return {
    success: true,
    redirectTo: '/dashboard'
  }

}

export async function logout() {
  const supabase = await createClient()

  console.log("triggering logout")

  const { error } = await supabase.auth.signOut()

  console.log("logout error", error)

  if (error) {
    console.error("Logout failed:", error)
    redirect('/error')
  }

  
  // Redirect to home or login page
  redirect('/login')
}