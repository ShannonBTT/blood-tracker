import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'

interface UrineTestsStepProps {
  form: UseFormReturn<BloodTestForm>
}

const URINE_TESTS = [
  { id: 'ua', label: 'Voided Urinalysis', section: 'urineTests' },
  { id: 'catheterizedUrinalysis', label: 'Catheterized Urinalysis', section: 'urineTests' },
  { id: 'hcgu', label: 'HCG - Urine', section: 'urineTests' },
  { id: 'clgp', label: 'Urine for Chlamydia and G.C. - First stream', section: 'urineTests' },
  { id: 'albcr', label: 'Random Albumin/Creatinine Ratio (Microalbumin)', section: 'urineTests' },
] as const

const URINE_COLLECTION = [
  { id: 'caud', label: 'Calcium', section: 'urineCollection' },
  { id: 'creud', label: 'Creatinine', section: 'urineCollection' },
  { id: 'crcl', label: 'Creatinine Clearance', section: 'urineCollection' },
  { id: 'crclc', label: 'Creatinine Clearance (BSA Corrected)', section: 'urineCollection' },
  { id: 'po4ud', label: 'Phosphate', section: 'urineCollection' },
  { id: 'tpud', label: 'Protein', section: 'urineCollection' },
  { id: 'peu', label: 'Protein Electrophoresis', section: 'urineCollection' },
  { id: 'nakud', label: 'Sodium / Potassium', section: 'urineCollection' },
  { id: 'ureud', label: 'Urea', section: 'urineCollection' },
  { id: 'uraud', label: 'Uric Acid', section: 'urineCollection' },
] as const

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

  const handleCheckboxChange = (section: 'urineTests' | 'urineCollection', id: string, checked: boolean) => {
    setValue(createPath(section, id as any), checked, {
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
          {URINE_TESTS.map(({ id, label, section }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={urineTests?.[id as keyof typeof urineTests] || false}
                onCheckedChange={(checked) => handleCheckboxChange(section, id, checked as boolean)}
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
          {URINE_COLLECTION.map(({ id, label, section }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={urineCollection?.[id as keyof typeof urineCollection] || false}
                onCheckedChange={(checked) => handleCheckboxChange(section, id, checked as boolean)}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 