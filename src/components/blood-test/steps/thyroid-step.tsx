import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'

interface ThyroidStepProps {
  form: UseFormReturn<BloodTestForm>
}

export function ThyroidStep({ form }: ThyroidStepProps) {
  const { setValue, watch } = form
  const values = watch('thyroid')

  const handleCheckboxChange = (id: keyof BloodTestForm['thyroid'], checked: boolean) => {
    setValue(createPath('thyroid', id), checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  // ... rest of the component
} 