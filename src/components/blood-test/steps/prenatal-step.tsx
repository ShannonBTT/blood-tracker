import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'

interface PrenatalStepProps {
  form: UseFormReturn<BloodTestForm>
}

const PRENATAL_OPTIONS = [
  { id: 'preim', label: 'Prenatal Screen' },
  { id: 'pblgp', label: 'Prenatal Group and Screen' },
  { id: 'paternalTest', label: 'Prenatal Group*, Phenotyping (Paternal Testing)' },
] as const

export function PrenatalStep({ form }: PrenatalStepProps) {
  const { setValue, watch } = form
  const values = watch('prenatal')

  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setValue(`prenatal.${id}`, checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {PRENATAL_OPTIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={values?.[id] || false}
              onCheckedChange={(checked) => handleCheckboxChange(id, checked as boolean)}
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  )
} 