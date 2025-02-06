export interface AuthFormData {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
} 