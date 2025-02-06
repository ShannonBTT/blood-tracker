import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'

interface UrineTestsStepProps {
  form: UseFormReturn<BloodTestForm>
}

const URINE_TEST_OPTIONS = [
  { id: 'ua', label: 'Voided Urinalysis', category: 'Basic' },
  { id: 'catheterizedUrinalysis', label: 'Catheterized Urinalysis', category: 'Basic' },
  { id: 'hcgu', label: 'HCG - Urine', category: 'Basic' },
  { id: 'clgp', label: 'Urine for Chlamydia and G.C. - First stream', category: 'Basic' },
  { id: 'albcr', label: 'Random Albumin/Creatinine Ratio (Microalbumin)', category: 'Basic' },
] as const

const URINE_COLLECTION_OPTIONS = [
  { id: 'caud', label: 'Calcium', category: 'Collection' },
  { id: 'creud', label: 'Creatinine', category: 'Collection' },
  { id: 'crcl', label: 'Creatinine Clearance', category: 'Collection' },
  { id: 'crclc', label: 'Creatinine Clearance (BSA Corrected)', category: 'Collection' },
  { id: 'po4ud', label: 'Phosphate', category: 'Collection' },
  { id: 'tpud', label: 'Protein', category: 'Collection' },
  { id: 'peu', label: 'Protein Electrophoresis', category: 'Collection' },
  { id: 'nakud', label: 'Sodium / Potassium', category: 'Collection' },
  { id: 'ureud', label: 'Urea', category: 'Collection' },
  { id: 'uraud', label: 'Uric Acid', category: 'Collection' },
] as const

export function UrineTestsStep({ form }: UrineTestsStepProps) {
  const { register, watch, setValue } = form
  const formValues = watch()
  
  // Debug log current form values
  console.log('🧪 Current urine test values:', {
    urineTests: formValues.urineTests,
    urineCollection: formValues.urineCollection
  })

  const hasCollectionTests = Object.entries(watch('urineCollection')).some(
    ([key, value]) => key !== 'startDate' && key !== 'startTime' && key !== 'endDate' && key !== 'endTime' && value === true
  )

  const handleCheckboxChange = (section: 'urineTests' | 'urineCollection', id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(`${section}.${id}`, e.target.checked)
    
    // Debug log after change
    const updatedValues = watch()
    console.log(`🧪 Updated ${section}.${id} to:`, e.target.checked)
    console.log('🧪 Form values after update:', {
      urineTests: updatedValues.urineTests,
      urineCollection: updatedValues.urineCollection
    })
  }

  return (
    <div className="space-y-8">
      {/* Basic Urine Tests */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Basic Urine Tests</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {URINE_TEST_OPTIONS.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={formValues.urineTests[id]}
                onCheckedChange={(checked) => {
                  setValue(`urineTests.${id}`, checked === true)
                  // Debug log after change
                  const updatedValues = watch()
                  console.log(`🧪 Updated urineTests.${id} to:`, checked)
                  console.log('🧪 Form values after update:', {
                    urineTests: updatedValues.urineTests,
                    urineCollection: updatedValues.urineCollection
                  })
                }}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* 24-Hour Urine Collection Tests */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">24-Hour Urine Collection Tests</h3>
        
        {/* Collection Period */}
        <div className="grid gap-4 sm:grid-cols-2 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              {...register('urineCollection.startDate')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              {...register('urineCollection.startTime')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              {...register('urineCollection.endDate')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              {...register('urineCollection.endTime')}
            />
          </div>
        </div>

        {/* Collection Tests */}
        <div className="grid gap-4 sm:grid-cols-2">
          {URINE_COLLECTION_OPTIONS.map(({ id, label }) => (
            <div key={id}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={formValues.urineCollection[id]}
                  onCheckedChange={(checked) => {
                    setValue(`urineCollection.${id}`, checked === true)
                    // Debug log after change
                    const updatedValues = watch()
                    console.log(`🧪 Updated urineCollection.${id} to:`, checked)
                    console.log('🧪 Form values after update:', {
                      urineTests: updatedValues.urineTests,
                      urineCollection: updatedValues.urineCollection
                    })
                  }}
                />
                <Label htmlFor={id}>{label}</Label>
              </div>
              
              {/* BSA Fields */}
              {id === 'crclc' && formValues.urineCollection.crclc && (
                <div className="mt-2 ml-6 p-3 border rounded-md bg-muted/50">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="height">HT (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        {...register('urineCollection.height')}
                        placeholder="Enter height"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">WT (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        {...register('urineCollection.weight')}
                        placeholder="Enter weight"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 