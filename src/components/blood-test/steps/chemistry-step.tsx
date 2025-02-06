import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'

interface ChemistryStepProps {
  form: UseFormReturn<BloodTestForm>
}

const CHEMISTRY_OPTIONS = [
  { id: 'lyte4', label: 'Electrolytes - Na, K, Cl, CO₂' },
  { id: 'creat', label: 'Creatinine + eGFR' },
  { id: 'urea', label: 'Urea' },
  { id: 'glucr', label: 'Glucose - Random' },
  { id: 'glucf', label: 'Glucose - FASTING' },
  { id: 'hma1c', label: 'Hemoglobin A1C' },
  { id: 'crcle', label: 'Est. Creatinine Clearance' },
] as const

export function ChemistryStep({ form }: ChemistryStepProps) {
  const { setValue, watch, register } = form
  const values = watch('chemistry')

  // Handle checkbox change
  const handleCheckboxChange = (id: keyof BloodTestForm['chemistry'], checked: boolean) => {
    setValue(createPath('chemistry', id), checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {CHEMISTRY_OPTIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={values?.[id] || false}
              onCheckedChange={(checked) => handleCheckboxChange(id as keyof BloodTestForm['chemistry'], checked as boolean)}
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
      </div>

      {/* Weight field for Creatinine Clearance */}
      {values?.crcle && (
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            {...register('chemistry.weight')}
            placeholder="Enter weight in kg"
            className="max-w-[200px]"
          />
        </div>
      )}
    </div>
  )
} 