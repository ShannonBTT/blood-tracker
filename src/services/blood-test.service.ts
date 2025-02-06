import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import type { BloodTestForm, BloodTestWithMeta, TestResults } from '@/types/blood-test-form'

export async function getBloodTests(userId: string): Promise<BloodTestWithMeta[]> {
  const bloodTestsRef = collection(db, 'blood_tests')
  const q = query(
    bloodTestsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BloodTestWithMeta[]
}

interface TrendsData {
  dates: Date[]
  values: Record<keyof TestResults, number[]>
}

export function calculateTrendsData(bloodTests: BloodTestWithMeta[]): TrendsData {
  const initialValues: Record<keyof TestResults, number[]> = {
    whiteBloodCells: [],
    redBloodCells: [],
    hemoglobin: [],
    hematocrit: [],
    platelets: [],
    glucose: [],
    creatinine: [],
    sodium: [],
    potassium: [],
    chloride: []
  }

  return {
    dates: bloodTests.map(test => new Date(test.createdAt)),
    values: initialValues
  }
} 