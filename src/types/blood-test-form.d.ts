export interface BloodTestWithMeta extends BloodTestForm {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'completed' | 'archived'
}

export interface TestResults {
  whiteBloodCells: number
  redBloodCells: number
  hemoglobin: number
  hematocrit: number
  platelets: number
  glucose: number
  creatinine: number
  sodium: number
  potassium: number
  chloride: number
}

export interface PatientInfo {
  clinicName: string
  phn: string
  chartNumber: string
  lastName: string
  firstName: string
  collectionDate: string
  collectionTime: string
}

// ... rest of the existing types ... 