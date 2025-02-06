import { 
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type DocumentData,
  enableNetwork,
  disableNetwork,
  waitForPendingWrites
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { BloodTestForm } from '@/types/blood-test-form'

const COLLECTION = 'blood_tests'
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

interface CreateBloodTestParams {
  userId: string
  formData: BloodTestForm
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function createBloodTest({ userId, formData }: CreateBloodTestParams) {
  console.log('🚀 Starting createBloodTest function')
  console.log('📝 User ID:', userId)
  console.log('📝 Form Data:', JSON.stringify(formData, null, 2))

  if (!userId) throw new Error('User ID is required')
  if (!formData) throw new Error('Form data is required')
  
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`\n🔄 Attempt ${attempt + 1} of ${MAX_RETRIES}`)

      // Try to enable network if it was disabled
      try {
        console.log('🌐 Enabling network...')
        await enableNetwork(db)
        console.log('✅ Network enabled successfully')
      } catch (networkError) {
        console.warn('⚠️ Failed to enable network:', networkError)
      }

      // Prepare the document data
      const docData = {
        userId,
        formData,
        status: 'draft',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      console.log('📄 Prepared document data:', JSON.stringify(docData, null, 2))

      // Create the document
      console.log('💾 Creating document in Firestore...')
      const docRef = await addDoc(collection(db, COLLECTION), docData)
      console.log('✅ Document created with ID:', docRef.id)

      // Wait for pending writes to complete
      console.log('⏳ Waiting for pending writes...')
      await waitForPendingWrites(db)
      console.log('✅ All pending writes completed')

      // Verify the document was created
      console.log('🔍 Verifying document creation...')
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        throw new Error('Failed to verify document creation')
      }

      const result = {
        id: docRef.id,
        ...docSnap.data()
      }
      console.log('✅ Document verified and retrieved:', JSON.stringify(result, null, 2))
      
      return result
    } catch (error) {
      lastError = error as Error
      console.error(`❌ Attempt ${attempt + 1} failed:`, error)
      
      // If we have network issues, try disabling and re-enabling the network
      if (error instanceof Error && error.message.includes('network')) {
        try {
          console.log('🔄 Resetting network connection...')
          await disableNetwork(db)
          await delay(1000)
          await enableNetwork(db)
          console.log('✅ Network reset completed')
        } catch (networkError) {
          console.warn('⚠️ Failed to reset network:', networkError)
        }
      }
      
      if (attempt < MAX_RETRIES - 1) {
        const waitTime = RETRY_DELAY * Math.pow(2, attempt)
        console.log(`⏳ Retrying in ${waitTime}ms...`)
        await delay(waitTime)
      }
    }
  }

  // If we get here, all retries failed
  console.error('❌ All attempts to create blood test failed')
  console.error('Last error:', lastError)
  throw new Error(`Failed to create blood test after ${MAX_RETRIES} attempts: ${lastError?.message}`)
}

export async function getBloodTest(id: string) {
  if (!id) throw new Error('Blood test ID is required')

  try {
    console.log('🔍 Fetching blood test:', id)
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.warn('❌ Blood test not found:', id)
      return null
    }

    const data = docSnap.data()
    
    // Transform the data to match the expected format
    const transformedData = {
      id: docSnap.id,
      userId: data.userId,
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
      status: data.status,
      // Spread the form data but ensure microbiology data is properly structured
      ...data.formData,
      // Explicitly transform microbiology data to ensure all fields are present
      microbiology: {
        bloodCultureCAndS: data.formData?.microbiology?.bloodCultureCAndS || false,
        cervixSwabGC: data.formData?.microbiology?.cervixSwabGC || false,
        sputumCAndS: data.formData?.microbiology?.sputumCAndS || false,
        sputumTBAfb: data.formData?.microbiology?.sputumTBAfb || false,
        stoolCAndS: data.formData?.microbiology?.stoolCAndS || false,
        stoolOAndP: data.formData?.microbiology?.stoolOAndP || false,
        stoolCDiff: data.formData?.microbiology?.stoolCDiff || false,
        throatCAndS: data.formData?.microbiology?.throatCAndS || false,
        urethralSwabGC: data.formData?.microbiology?.urethralSwabGC || false,
        urineCatheterCAndS: data.formData?.microbiology?.urineCatheterCAndS || false,
        urineCatheterYeast: data.formData?.microbiology?.urineCatheterYeast || false,
        urineMidstreamCAndS: data.formData?.microbiology?.urineMidstreamCAndS || false,
        urineMidstreamYeast: data.formData?.microbiology?.urineMidstreamYeast || false,
        vaginalBV: data.formData?.microbiology?.vaginalBV || false,
        vaginalTrich: data.formData?.microbiology?.vaginalTrich || false,
        groupBStrep: data.formData?.microbiology?.groupBStrep || false,
        source: data.formData?.microbiology?.source || '',
        source2: data.formData?.microbiology?.source2 || '',
        otherTests: data.formData?.microbiology?.otherTests || ''
      }
    }

    return transformedData
  } catch (error) {
    console.error('❌ Error fetching blood test:', error)
    throw new Error(`Failed to fetch blood test: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getBloodTests(userId: string) {
  if (!userId) throw new Error('User ID is required')

  try {
    console.log('🔍 Fetching blood tests for user:', userId)
    const bloodTestsRef = collection(db, COLLECTION)
    const q = query(
      bloodTestsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    console.log(`✅ Found ${querySnapshot.docs.length} blood tests`)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()

      const transformedData = {
        id: doc.id,
        userId: data.userId,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
        status: data.status,
        // Spread the form data but ensure microbiology data is properly structured
        ...data.formData,
        // Explicitly transform microbiology data to ensure all fields are present
        microbiology: {
          bloodCultureCAndS: data.formData?.microbiology?.bloodCultureCAndS || false,
          cervixSwabGC: data.formData?.microbiology?.cervixSwabGC || false,
          sputumCAndS: data.formData?.microbiology?.sputumCAndS || false,
          sputumTBAfb: data.formData?.microbiology?.sputumTBAfb || false,
          stoolCAndS: data.formData?.microbiology?.stoolCAndS || false,
          stoolOAndP: data.formData?.microbiology?.stoolOAndP || false,
          stoolCDiff: data.formData?.microbiology?.stoolCDiff || false,
          throatCAndS: data.formData?.microbiology?.throatCAndS || false,
          urethralSwabGC: data.formData?.microbiology?.urethralSwabGC || false,
          urineCatheterCAndS: data.formData?.microbiology?.urineCatheterCAndS || false,
          urineCatheterYeast: data.formData?.microbiology?.urineCatheterYeast || false,
          urineMidstreamCAndS: data.formData?.microbiology?.urineMidstreamCAndS || false,
          urineMidstreamYeast: data.formData?.microbiology?.urineMidstreamYeast || false,
          vaginalBV: data.formData?.microbiology?.vaginalBV || false,
          vaginalTrich: data.formData?.microbiology?.vaginalTrich || false,
          groupBStrep: data.formData?.microbiology?.groupBStrep || false,
          source: data.formData?.microbiology?.source || '',
          source2: data.formData?.microbiology?.source2 || '',
          otherTests: data.formData?.microbiology?.otherTests || ''
        }
      }

      return transformedData
    })
  } catch (error) {
    console.error('❌ Error fetching blood tests:', error)
    throw new Error(`Failed to fetch blood tests: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateBloodTest(id: string, updates: Partial<DocumentData>) {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    })

    const updatedDoc = await getDoc(docRef)
    if (!updatedDoc.exists()) {
      throw new Error('Blood test not found after update')
    }

    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    }
  } catch (error) {
    console.error('Error updating blood test:', error)
    throw error
  }
}

export async function deleteBloodTest(id: string) {
  if (!id) throw new Error('Blood test ID is required')

  try {
    console.log('🗑️ Deleting blood test:', id)
    const docRef = doc(db, COLLECTION, id)

    // Verify the document exists before deleting
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error('Blood test not found')
    }

    await deleteDoc(docRef)
    console.log('✅ Blood test deleted successfully')
    return true
  } catch (error) {
    console.error('❌ Error deleting blood test:', error)
    throw new Error(`Failed to delete blood test: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 