import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'
import type { CheckedState } from '@radix-ui/react-checkbox'

interface UrineTestsStepProps {
  form: UseFormReturn<BloodTestForm>
}

type UrineTestId = keyof BloodTestForm['urineTests']
type UrineCollectionId = Exclude<keyof BloodTestForm['urineCollection'], 'startDate' | 'startTime' | 'endDate' | 'endTime' | 'height' | 'weight'>

const URINE_TESTS = [
  { id: 'ua' as const, label: 'Voided Urinalysis', section: 'urineTests' as const },
  { id: 'catheterizedUrinalysis' as const, label: 'Catheterized Urinalysis', section: 'urineTests' as const },
  { id: 'hcgu' as const, label: 'HCG - Urine', section: 'urineTests' as const },
  { id: 'clgp' as const, label: 'Urine for Chlamydia and G.C. - First stream', section: 'urineTests' as const },
  { id: 'albcr' as const, label: 'Random Albumin/Creatinine Ratio (Microalbumin)', section: 'urineTests' as const },
]

const URINE_COLLECTION = [
  { id: 'caud' as const, label: 'Calcium', section: 'urineCollection' as const },
  { id: 'creud' as const, label: 'Creatinine', section: 'urineCollection' as const },
  { id: 'crcl' as const, label: 'Creatinine Clearance', section: 'urineCollection' as const },
  { id: 'crclc' as const, label: 'Creatinine Clearance (BSA Corrected)', section: 'urineCollection' as const },
  { id: 'po4ud' as const, label: 'Phosphate', section: 'urineCollection' as const },
  { id: 'tpud' as const, label: 'Protein', section: 'urineCollection' as const },
  { id: 'peu' as const, label: 'Protein Electrophoresis', section: 'urineCollection' as const },
  { id: 'nakud' as const, label: 'Sodium / Potassium', section: 'urineCollection' as const },
  { id: 'ureud' as const, label: 'Urea', section: 'urineCollection' as const },
  { id: 'uraud' as const, label: 'Uric Acid', section: 'urineCollection' as const },
]

export function UrineTestsStep({ form }: UrineTestsStepProps) {
  const { register, watch, setValue } = form
  const urineTests = watch('urineTests')
  const urineCollection = watch('urineCollection')
  
  // Debug log current form values
  console.log('🧪 Current urine test values:', {
    urineTests: urineTests,
    urineCollection: urineCollection
  })

  const hasCollectionTests = Object.entries(urineCollection).some(
    ([key, value]) => key !== 'startDate' && key !== 'startTime' && key !== 'endDate' && key !== 'endTime' && value === true
  )

  const handleUrineTestChange = (id: UrineTestId, checked: CheckedState) => {
    setValue(`urineTests.${id}`, checked === true, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handleCollectionTestChange = (id: UrineCollectionId, checked: CheckedState) => {
    setValue(`urineCollection.${id}`, checked === true, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-8">
      {/* Basic Urine Tests */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Basic Urine Tests</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {URINE_TESTS.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={urineTests?.[id] || false}
                onCheckedChange={(checked) => handleUrineTestChange(id, checked)}
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
          {URINE_COLLECTION.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={urineCollection?.[id] || false}
                onCheckedChange={(checked) => handleCollectionTestChange(id, checked)}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 