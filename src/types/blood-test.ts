export interface BloodTest {
  id: string
  userId: string
  testDate: Date
  testResults: TestResults
  symptoms: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface TestResults {
  whiteBloodCells: number
  redBloodCells: number
  hemoglobin: number
  hematocrit: number
  platelets: number
  neutrophils: number
  lymphocytes: number
  monocytes: number
  eosinophils: number
  basophils: number
}

export interface BloodTestFormData {
  testDate: Date
  testResults: Partial<TestResults>
  symptoms: string[]
  notes?: string
}

export interface BloodTestFilters {
  startDate?: Date
  endDate?: Date
  sortBy?: 'testDate' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface BloodTestStats {
  totalTests: number
  averageResults: Partial<TestResults>
  latestTest?: BloodTest
  trendsData: {
    dates: Date[]
    values: Record<keyof TestResults, number[]>
  }
} 