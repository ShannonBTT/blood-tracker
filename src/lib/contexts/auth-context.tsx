import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 Initialisation du contexte d\'authentification')
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('👤 Changement d\'état d\'authentification:', user ? 'Connecté' : 'Non connecté')
      if (user) {
        console.log('✅ Utilisateur connecté:', user.uid)
      }
      setUser(user)
      setIsLoading(false)
    })

    return () => {
      console.log('🔄 Nettoyage du listener d\'authentification')
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Tentative de connexion...')
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Connexion réussie:', result.user.uid)
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log('🚪 Tentative de déconnexion...')
    try {
      await firebaseSignOut(auth)
      console.log('✅ Déconnexion réussie')
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error)
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 