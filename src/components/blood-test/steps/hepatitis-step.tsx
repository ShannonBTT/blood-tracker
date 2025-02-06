import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'

interface HepatitisStepProps {
  form: UseFormReturn<BloodTestForm>
}

const HEPATITIS_OPTIONS = [
  { id: 'heppa', label: 'Acute viral hepatitis undefined etiology' },
  { id: 'hbchb', label: 'Hepatitis B (Hep B S Ab, Hep B S Ag, Hep Bc Tot Ab)' },
  { id: 'hcab', label: 'Hepatitis C (Hep C Ab)' },
  { id: 'haabt', label: 'Hepatitis A (Hep A Total Ab)' },
  { id: 'hbabs', label: 'Hepatitis B (Hep B S Ab)' },
  { id: 'cmva', label: 'Acute CMV (CMV IgM)' },
  { id: 'cmvi', label: 'Chronic or Past Exposure to CMV (CMV IgG)' },
] as const

export function HepatitisStep({ form }: HepatitisStepProps) {
  const { setValue, watch } = form
  const values = watch('hepatitis')

  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setValue(`hepatitis.${id}`, checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {HEPATITIS_OPTIONS.map(({ id, label }) => (
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