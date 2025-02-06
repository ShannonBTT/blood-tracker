import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'

interface LipidsStepProps {
  form: UseFormReturn<BloodTestForm>
}

const LIPIDS_OPTIONS = [
  { id: 'trig', label: 'Triglyceride - FASTING' },
  { id: 'chol', label: 'Cholesterol - Total - FASTING' },
  { id: 'lipid', label: 'Chol, Trig, HDL, LDL - FASTING' },
  { id: 'ges1h', label: 'Gestational Challenge (50g) - Non Fasting' },
  { id: 'ges2h', label: 'Gestational Tolerance (75g) - FASTING' },
  { id: 'gtt2h', label: 'Glucose Tolerance (75g) - FASTING' },
] as const

export function LipidsStep({ form }: LipidsStepProps) {
  const { setValue, watch } = form
  const values = watch('lipids')

  const handleCheckboxChange = (id: keyof BloodTestForm['lipids'], checked: boolean) => {
    setValue(createPath('lipids', id), checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {LIPIDS_OPTIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={values?.[id] || false}
              onCheckedChange={(checked) => handleCheckboxChange(id as keyof BloodTestForm['lipids'], checked as boolean)}
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  )
} 