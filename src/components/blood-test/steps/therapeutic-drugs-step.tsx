import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'

interface TherapeuticDrugsStepProps {
  form: UseFormReturn<BloodTestForm>
}

const THERAPEUTIC_DRUGS_OPTIONS = [
  { id: 'carbz', label: 'Carbamazepine (Tegretol)' },
  { id: 'digi', label: 'Digoxin' },
  { id: 'lith', label: 'Lithium' },
  { id: 'phenb', label: 'Phenobarbital' },
  { id: 'ptny', label: 'Phenytoin (Dilantin)' },
  { id: 'valpr', label: 'Valproic Acid (Epival)' },
  { id: 'cycl', label: 'Cyclosporin - Pre' },
  { id: 'cy2', label: 'Cyclosporin - Post' },
  { id: 'tacr', label: 'Tacrolimus - Pre' },
  { id: 'siro', label: 'Sirolimus - Pre' },
] as const

export function TherapeuticDrugsStep({ form }: TherapeuticDrugsStepProps) {
  const { setValue, watch, register } = form
  const values = watch('therapeuticDrugs')

  const handleCheckboxChange = (id: keyof BloodTestForm['therapeuticDrugs'], checked: boolean) => {
    setValue(createPath('therapeuticDrugs', id), checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {THERAPEUTIC_DRUGS_OPTIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={values?.[id] || false}
              onCheckedChange={(checked) => handleCheckboxChange(id as keyof BloodTestForm['therapeuticDrugs'], checked as boolean)}
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            {...register('therapeuticDrugs.dosage')}
            placeholder="Enter drug dosage"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateTime">Date/Time Last Taken</Label>
          <Input
            id="dateTime"
            type="datetime-local"
            {...register('therapeuticDrugs.dateTime')}
          />
        </div>
      </div>
    </div>
  )
} 