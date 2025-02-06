import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { 
  getFirestore, 
  getDocs, 
  collection, 
  limit, 
  query,
  enableIndexedDbPersistence,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)

// Initialize Firestore with settings for better offline support
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
})

// Enable offline persistence with better error handling
try {
  await enableIndexedDbPersistence(db, {
    forceOwnership: true
  })
  console.log('✅ Offline persistence enabled successfully')
} catch (err: unknown) {
  if (err && typeof err === 'object' && 'code' in err) {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open, persistence only enabled in one tab')
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Current browser doesn\'t support persistence')
    }
  } else {
    console.error('❌ Error enabling persistence:', err)
  }
}

// Test Firebase connection with better error handling
export async function testFirebaseConnection() {
  try {
    // Test auth initialization
    const authInstance = getAuth(app)
    if (!authInstance) throw new Error('Auth initialization failed')
    console.log('✅ Firebase Auth initialized successfully')

    // Test if we can get the current user state
    const authStatePromise = new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        authInstance,
        (user) => {
          unsubscribe()
          resolve(true)
        },
        (error) => {
          unsubscribe()
          reject(error)
        }
      )

      // Add timeout
      setTimeout(() => {
        unsubscribe()
        reject(new Error('Auth state check timed out'))
      }, 5000)
    })

    await authStatePromise
    console.log('✅ Firebase connection test successful')
    return true
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error)
    return false
  }
} 