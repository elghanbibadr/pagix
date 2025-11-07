'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()


  console.log("trigeering sign up")
  console.log("form data",formData)
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const {email,password,fullName} = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
  }


  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        // phone: phone,
      },
      // This sends the confirmation email
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    }
  })


  console.log("error",error)

  console.log('sign up data',authData)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/email-confirmation')
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