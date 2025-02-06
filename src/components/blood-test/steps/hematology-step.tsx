import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'

interface HematologyStepProps {
  form: UseFormReturn<BloodTestForm>
}

const HEMATOLOGY_OPTIONS = [
  { id: 'cbcDiff', label: 'CBC & diff' },
  { id: 'reticulocyteCount', label: 'Reticulocyte Count' },
  { id: 'dDimer', label: 'D-Dimer' },
  { id: 'fibrinogenLevel', label: 'Fibrinogen Level' },
  { id: 'ptInr', label: 'PT (INR)' },
  { id: 'pttAptt', label: 'PTT (APTT)' },
] as const

export function HematologyStep({ form }: HematologyStepProps) {
  const { setValue, watch } = form
  const values = watch('hematology')

  const handleCheckboxChange = (id: keyof BloodTestForm['hematology'], checked: boolean) => {
    setValue(createPath('hematology', id), checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {HEMATOLOGY_OPTIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={values?.[id] || false}
              onCheckedChange={(checked) => handleCheckboxChange(id as keyof BloodTestForm['hematology'], checked as boolean)}
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  )
} 