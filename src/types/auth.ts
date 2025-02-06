import type { User as FirebaseUser } from 'firebase/auth'

export interface AuthFormData {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  error: Error | null
}

export interface UserProfile {
  id: string
  email: string
  createdAt: string
  updatedAt: string
} 