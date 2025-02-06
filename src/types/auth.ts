import type { User } from 'firebase/auth'

export interface AuthFormData {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
}

export interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
} 