import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'

interface BiochemistryStepProps {
  form: UseFormReturn<BloodTestForm>
}

const BIOCHEMISTRY_TESTS = [
  { id: 'alb', label: 'Albumin', category: 'Proteins and Enzymes' },
  { id: 'ca', label: 'Calcium', category: 'Minerals' },
  { id: 'phos', label: 'Phosphate', category: 'Minerals' },
  { id: 'mg', label: 'Magnesium', category: 'Minerals' },
  { id: 'uric', label: 'Uric Acid', category: 'Metabolites' },
  { id: 'alp', label: 'Alkaline Phosphatase', category: 'Enzymes' },
  { id: 'alt', label: 'Alanine Aminotransferase', category: 'Enzymes' },
  { id: 'ast', label: 'Aspartate Aminotransferase', category: 'Enzymes' },
  { id: 'ck', label: 'CK - Total', category: 'Enzymes' },
  { id: 'ld', label: 'Lactate Dehydrogenase', category: 'Enzymes' },
  { id: 'lip', label: 'Lipase', category: 'Enzymes' },
  { id: 'ggt', label: 'Gamma Glutamyltransferase', category: 'Enzymes' },
  { id: 'bilt', label: 'Bilirubin - Total', category: 'Metabolites' },
  { id: 'bilfr', label: 'Bilirubin - Fractionation', category: 'Metabolites' },
  { id: 'bhcg', label: 'BHCG (Quantitative - Level)', category: 'Hormones' },
  { id: 'ironb', label: 'Iron and Total Iron Binding Capacity', category: 'Minerals' },
  { id: 'fer', label: 'Ferritin', category: 'Proteins' },
  { id: 'psa', label: 'Prostate Specific Antigen', category: 'Tumor Markers' },
  { id: 'thysa', label: 'Thyroid Stimulating Hormone', category: 'Hormones' },
  { id: 'frt4', label: 'Free T4 (Free Thyroxine)', category: 'Hormones' },
  { id: 'atpa', label: 'Thyroid Peroxidase Antibody', category: 'Immunology' },
  { id: 'fshlh', label: 'Follicle Stimulating Hormone/Luteinizing Hormone', category: 'Hormones' },
  { id: 'ediol', label: 'Estradiol', category: 'Hormones' },
  { id: 'prge', label: 'Progesterone', category: 'Hormones' },
  { id: 'prl', label: 'Prolactin', category: 'Hormones' },
  { id: 'waser', label: 'Syphilis', category: 'Serology' },
  { id: 'hiv', label: 'HIV', category: 'Serology' },
  { id: 'crph', label: 'C-Reactive Protein-HS', category: 'Inflammation' },
  { id: 'rhf', label: 'Rheumatoid Factor', category: 'Immunology' },
  { id: 'tnths', label: 'Troponin T HS', category: 'Cardiac' },
  { id: 'tp', label: 'Total Protein', category: 'Proteins' },
  { id: 'pes', label: 'Serum Protein Electrophoresis', category: 'Proteins' },
  { id: 'fitOccult', label: 'Fecal Immunochemical Test (FIT) for Occult Blood', category: 'Screening' }
] as const

export function BiochemistryStep({ form }: BiochemistryStepProps) {
  const { setValue, watch } = form
  const values = watch('biochemistry')

  const handleCheckboxChange = (id: keyof BloodTestForm['biochemistry'], checked: boolean) => {
    setValue(createPath('biochemistry', id), checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  // Group tests by category
  const groupedTests = BIOCHEMISTRY_TESTS.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = []
    }
    acc[test.category].push(test)
    return acc
  }, {} as Record<string, typeof BIOCHEMISTRY_TESTS[number][]>)

  return (
    <div className="space-y-6">
      {Object.entries(groupedTests).map(([category, tests]) => (
        <div key={category} className="space-y-4">
          <h3 className="font-medium text-lg">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center space-x-2">
                <Checkbox
                  id={test.id}
                  checked={values?.[test.id] || false}
                  onCheckedChange={(checked) => handleCheckboxChange(test.id as keyof BloodTestForm['biochemistry'], checked as boolean)}
                />
                <Label htmlFor={test.id}>{test.label}</Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 