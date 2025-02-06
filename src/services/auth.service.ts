import { supabase } from '@/lib/supabase'
import type { AuthFormData } from '@/types/auth'

export async function signIn({ email, password }: AuthFormData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)
  return data
}

export async function signUp({ email, password }: AuthFormData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw new Error(error.message)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw new Error(error.message)
} 