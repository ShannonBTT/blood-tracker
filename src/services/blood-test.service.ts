import { supabase } from '@/lib/supabase'
import type { 
  BloodTest, 
  BloodTestFormData, 
  BloodTestFilters,
  BloodTestStats 
} from '@/types/blood-test'

interface FetchBloodTestsParams {
  userId: string
  filters?: BloodTestFilters
}

interface FetchBloodTestStatsParams {
  userId: string
  startDate?: Date
  endDate?: Date
}

export async function createBloodTest({ userId, ...data }: BloodTestFormData & { userId: string }): Promise<BloodTest> {
  const { data: bloodTest, error } = await supabase
    .from('blood_tests')
    .insert([
      {
        user_id: userId,
        test_date: data.testDate,
        test_results: data.testResults,
        symptoms: data.symptoms,
        notes: data.notes
      }
    ])
    .select()
    .single()

  if (error) throw new Error('Failed to create blood test')
  return bloodTest
}

export async function fetchBloodTests({ userId, filters }: FetchBloodTestsParams): Promise<BloodTest[]> {
  let query = supabase
    .from('blood_tests')
    .select('*')
    .eq('user_id', userId)

  if (filters?.startDate) 
    query = query.gte('test_date', filters.startDate)
  
  if (filters?.endDate) 
    query = query.lte('test_date', filters.endDate)
  
  if (filters?.sortBy) 
    query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })

  const { data: bloodTests, error } = await query

  if (error) throw new Error('Failed to fetch blood tests')
  return bloodTests
}

export async function fetchBloodTestStats({ userId, startDate, endDate }: FetchBloodTestStatsParams): Promise<BloodTestStats> {
  const { data: bloodTests, error } = await supabase
    .from('blood_tests')
    .select('*')
    .eq('user_id', userId)
    .gte('test_date', startDate ?? new Date(0))
    .lte('test_date', endDate ?? new Date())
    .order('test_date', { ascending: true })

  if (error) throw new Error('Failed to fetch blood test stats')

  // Calculate statistics from blood tests
  const stats: BloodTestStats = {
    totalTests: bloodTests.length,
    averageResults: calculateAverageResults(bloodTests),
    latestTest: bloodTests[bloodTests.length - 1],
    trendsData: calculateTrendsData(bloodTests)
  }

  return stats
}

function calculateAverageResults(bloodTests: BloodTest[]) {
  // Implementation for calculating averages
  return {} // TODO: Implement average calculation
}

function calculateTrendsData(bloodTests: BloodTest[]) {
  // Implementation for calculating trends
  return {
    dates: [],
    values: {}
  } // TODO: Implement trends calculation
} 