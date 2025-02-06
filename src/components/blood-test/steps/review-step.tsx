import { UseFormReturn } from 'react-hook-form'
import type { BloodTestForm } from '@/types/blood-test-form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { formatMicrobiologyData, formatTestData, TEST_LABELS } from '@/lib/utils/test-labels'

interface ReviewStepProps {
  form: UseFormReturn<BloodTestForm>
  onSubmit: () => Promise<void> | void
  isSubmitting: boolean
}

type TestSection = {
  [key: string]: boolean | string | undefined
}

export function ReviewStep({ form, onSubmit, isSubmitting }: ReviewStepProps) {
  const { watch } = form
  const formData = watch()

  // Helper function to format date and time
  function formatDateTime(date: string, time: string) {
    if (!date) return 'Not specified'
    return `${date} ${time || ''}`
  }

  // Helper function to get selected options from a section with labels
  function getSelectedOptions(
    section: TestSection,
    sectionLabels: Record<string, string>
  ): Array<{ key: string; label: string }> {
    if (!section || !sectionLabels) return []
    
    return Object.entries(section)
      .filter(([_, value]) => value === true)
      .map(([key]) => ({
        key,
        label: sectionLabels[key] || key
      }))
  }

  // Check if any tests are selected with null checks
  const hasTherapeuticDrugs = formData.therapeuticDrugs && Object.values(formData.therapeuticDrugs)
    .filter(value => typeof value === 'boolean')
    .some(value => value)
  const hasHematology = formData.hematology && Object.values(formData.hematology)
    .filter(value => typeof value === 'boolean')
    .some(value => value)
  const hasChemistry = formData.chemistry && Object.values(formData.chemistry)
    .filter(value => typeof value === 'boolean')
    .some(value => value)
  const hasLipids = formData.lipids && Object.values(formData.lipids)
    .filter(value => typeof value === 'boolean')
    .some(value => value)
  const hasBiochemistry = formData.biochemistry && TEST_LABELS.biochemistry && Object.values(formData.biochemistry)
    .filter(value => typeof value === 'boolean')
    .some(value => value)
  const hasPrenatal = formData.prenatal && Object.values(formData.prenatal)
    .filter(value => typeof value === 'boolean')
    .some(value => value)
  const hasUrineTests = formData.urineTests && Object.values(formData.urineTests)
    .filter(value => typeof value === 'boolean')
    .some(value => value)
  const hasHepatitis = formData.hepatitis && Object.values(formData.hepatitis)
    .filter(value => typeof value === 'boolean')
    .some(value => value)
  const hasMicrobiology = formData.microbiology && Object.values(formData.microbiology)
    .filter(value => typeof value === 'boolean')
    .some(value => value)

  useEffect(() => {
    const subscription = form.watch(() => {
      // No need to log changes here
    })
    return () => subscription.unsubscribe()
  }, [form])

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-medium">Name</p>
            <p>{formData.patientInfo.firstName} {formData.patientInfo.lastName}</p>
          </div>
          <div>
            <p className="font-medium">PHN</p>
            <p>{formData.patientInfo.phn || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Chart Number</p>
            <p>{formData.patientInfo.chartNumber || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Clinic Name</p>
            <p>{formData.patientInfo.clinicName || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Collection Date/Time</p>
            <p>{formatDateTime(formData.patientInfo.collectionDate, formData.patientInfo.collectionTime)}</p>
          </div>
          <div>
            <p className="font-medium">Requesting Physician</p>
            <p>{formData.requestingPhysician.firstName} {formData.requestingPhysician.lastName}</p>
          </div>
        </CardContent>
      </Card>

      {/* Therapeutic Drugs */}
      {hasTherapeuticDrugs && (
        <Card>
          <CardHeader>
            <CardTitle>Therapeutic Drugs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(formData.therapeuticDrugs as unknown as TestSection, TEST_LABELS.therapeuticDrugs).map(({ key, label }) => (
                <li key={key}>{label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Hematology */}
      {hasHematology && (
        <Card>
          <CardHeader>
            <CardTitle>Hematology</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(formData.hematology as unknown as TestSection, TEST_LABELS.hematology).map(({ key, label }) => (
                <li key={key}>{label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Chemistry */}
      {hasChemistry && (
        <Card>
          <CardHeader>
            <CardTitle>Chemistry</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(formData.chemistry as unknown as TestSection, TEST_LABELS.chemistry).map(({ key, label }) => (
                <li key={key}>{label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Lipids */}
      {hasLipids && (
        <Card>
          <CardHeader>
            <CardTitle>Lipids</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(formData.lipids as unknown as TestSection, TEST_LABELS.lipids).map(({ key, label }) => (
                <li key={key}>{label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Biochemistry */}
      {hasBiochemistry && (
        <Card>
          <CardHeader>
            <CardTitle>Biochemistry</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(formData.biochemistry as unknown as TestSection, TEST_LABELS.biochemistry).map(({ key, label }) => (
                <li key={key}>{label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Prenatal */}
      {hasPrenatal && (
        <Card>
          <CardHeader>
            <CardTitle>Prenatal</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(formData.prenatal as unknown as TestSection, TEST_LABELS.prenatal).map(({ key, label }) => (
                <li key={key}>{label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Urine Tests */}
      {hasUrineTests && (
        <Card>
          <CardHeader>
            <CardTitle>Urine Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(formData.urineTests as unknown as TestSection, TEST_LABELS.urineTests).map(({ key, label }) => (
                <li key={key}>{label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Hepatitis */}
      {hasHepatitis && (
        <Card>
          <CardHeader>
            <CardTitle>Hepatitis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(formData.hepatitis as unknown as TestSection, TEST_LABELS.hepatitis).map(({ key, label }) => (
                <li key={key}>{label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Microbiology */}
      {hasMicrobiology && (
        <Card>
          <CardHeader>
            <CardTitle>Microbiology</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {formatMicrobiologyData(formData.microbiology).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
          onClick={async () => {
            if (typeof onSubmit !== 'function') return
            try {
              await onSubmit()
            } catch (error) {
              // Keep only critical error logging
              console.error('Error during form submission:', error)
            }
          }}
        >
          {isSubmitting ? 'Saving Blood Test...' : 'Save Blood Test'}
        </Button>
      </div>
    </div>
  )
} 