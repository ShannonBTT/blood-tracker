import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'

interface BiochemistryStepProps {
  form: UseFormReturn<BloodTestForm>
}

const BIOCHEMISTRY_OPTIONS = [
  // Minerals and Electrolytes
  { id: 'alb', label: 'Albumin', category: 'Proteins and Enzymes' },
  { id: 'ca', label: 'Calcium', category: 'Minerals' },
  { id: 'phos', label: 'Phosphate', category: 'Minerals' },
  { id: 'mg', label: 'Magnesium', category: 'Minerals' },
  { id: 'uric', label: 'Uric Acid', category: 'Metabolites' },

  // Enzymes
  { id: 'alp', label: 'Alkaline Phosphatase', category: 'Enzymes' },
  { id: 'alt', label: 'Alanine Aminotransferase', category: 'Enzymes' },
  { id: 'ast', label: 'Aspartate Aminotransferase', category: 'Enzymes' },
  { id: 'ck', label: 'CK - Total', category: 'Enzymes' },
  { id: 'ld', label: 'Lactate Dehydrogenase', category: 'Enzymes' },
  { id: 'lip', label: 'Lipase', category: 'Enzymes' },
  { id: 'ggt', label: 'Gamma Glutamyltransferase', category: 'Enzymes' },

  // Bilirubin
  { id: 'bilt', label: 'Bilirubin - Total', category: 'Liver Function' },
  { id: 'bilfr', label: 'Bilirubin - Fractionation', category: 'Liver Function' },

  // Hormones and Proteins
  { id: 'bhcg', label: 'BHCG (Quantitative - Level)', category: 'Hormones' },
  { id: 'ironb', label: 'Iron and Total Iron Binding Capacity', category: 'Iron Studies' },
  { id: 'fer', label: 'Ferritin', category: 'Iron Studies' },
  { id: 'psa', label: 'Prostate Specific Antigen', category: 'Tumor Markers' },
  { id: 'thysa', label: 'Thyroid Stimulating Hormone', category: 'Thyroid Function' },
  { id: 'frt4', label: 'Free T4 (Free Thyroxine)', category: 'Thyroid Function' },
  { id: 'atpa', label: 'Thyroid Peroxidase Antibody', category: 'Thyroid Function' },

  // Reproductive Hormones
  { id: 'fshlh', label: 'Follicle Stimulating Hormone/Luteinizing Hormone', category: 'Reproductive' },
  { id: 'ediol', label: 'Estradiol', category: 'Reproductive' },
  { id: 'prge', label: 'Progesterone', category: 'Reproductive' },
  { id: 'prl', label: 'Prolactin', category: 'Reproductive' },

  // Infectious Disease and Inflammation
  { id: 'waser', label: 'Syphilis', category: 'Infectious Disease' },
  { id: 'hiv', label: 'HIV', category: 'Infectious Disease' },
  { id: 'crph', label: 'C-Reactive Protein-HS', category: 'Inflammation' },
  { id: 'rhf', label: 'Rheumatoid Factor', category: 'Inflammation' },
  { id: 'tnths', label: 'Troponin T HS', category: 'Cardiac' },

  // Proteins
  { id: 'tp', label: 'Total Protein', category: 'Proteins' },
  { id: 'pes', label: 'Serum Protein Electrophoresis', category: 'Proteins' },

  // Stool Tests
  { id: 'fitOccult', label: 'Stool for Fecal immunochemical test (Occult Blood)', category: 'Stool Tests' },
] as const

// Group options by category
const groupedOptions = BIOCHEMISTRY_OPTIONS.reduce((acc, option) => {
  if (!acc[option.category]) {
    acc[option.category] = []
  }
  acc[option.category].push(option)
  return acc
}, {} as Record<string, typeof BIOCHEMISTRY_OPTIONS>)

export function BiochemistryStep({ form }: BiochemistryStepProps) {
  const { setValue, watch } = form
  const values = watch('biochemistry')

  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setValue(`biochemistry.${id}`, checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedOptions).map(([category, options]) => (
        <div key={category} className="space-y-4">
          <h3 className="font-medium text-lg">{category}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {options.map(({ id, label }) => (
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
      ))}
    </div>
  )
} 