import {
  formatTherapeuticDrugs,
  formatHematologyTests,
  formatChemistryTests,
  formatLipidTests,
  formatBiochemistryTests,
  formatPrenatalTests,
  formatUrineTests,
  formatHepatitisTests,
  formatMicrobiologyData
} from '@/lib/utils/test-labels'
import type { BloodTest } from '@/types/blood-test-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BloodTestView({ bloodTest }: { bloodTest: BloodTest }) {
  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ... patient info display ... */}
        </CardContent>
      </Card>

      {/* Therapeutic Drugs */}
      <Card>
        <CardHeader>
          <CardTitle>Therapeutic Drugs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatTherapeuticDrugs(bloodTest.therapeuticDrugs).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Hematology */}
      <Card>
        <CardHeader>
          <CardTitle>Hematology</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatHematologyTests(bloodTest.hematology).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Chemistry */}
      <Card>
        <CardHeader>
          <CardTitle>Chemistry</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatChemistryTests(bloodTest.chemistry).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lipids */}
      <Card>
        <CardHeader>
          <CardTitle>Lipids</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatLipidTests(bloodTest.lipids).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Biochemistry */}
      <Card>
        <CardHeader>
          <CardTitle>Biochemistry</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatBiochemistryTests(bloodTest.biochemistry).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Prenatal */}
      <Card>
        <CardHeader>
          <CardTitle>Prenatal</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatPrenatalTests(bloodTest.prenatal).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Urine Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Urine Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatUrineTests(bloodTest.urineTests).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Hepatitis */}
      <Card>
        <CardHeader>
          <CardTitle>Hepatitis</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatHepatitisTests(bloodTest.hepatitis).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Microbiology */}
      <Card>
        <CardHeader>
          <CardTitle>Microbiology</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {formatMicrobiologyData(bloodTest.microbiology).map((item, index) => (
              <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 