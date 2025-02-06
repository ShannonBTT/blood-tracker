import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export async function signIn(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

export async function signUp(email: string, password: string): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  return user
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
} 