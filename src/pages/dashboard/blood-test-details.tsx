import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getBloodTest } from '@/lib/firebase/blood-tests'
import { useAuth } from '@/lib/contexts/auth-context'
import type { BloodTestWithMeta } from '@/types/blood-test-form'
import { generateBloodTestPdf } from '@/lib/utils/generate-pdf'
import { toast } from 'sonner'
import { formatMicrobiologyData } from '@/lib/utils/test-labels'

const TEST_LABELS = {
  therapeuticDrugs: {
    carbz: 'Carbamazepine (Tegretol)',
    digi: 'Digoxin',
    lith: 'Lithium',
    phenb: 'Phenobarbital',
    ptny: 'Phenytoin (Dilantin)',
    valpr: 'Valproic Acid (Epival)',
    cycl: 'Cyclosporin - Pre',
    cy2: 'Cyclosporin - Post',
    tacr: 'Tacrolimus - Pre',
    siro: 'Sirolimus - Pre',
  },
  hematology: {
    cbcDiff: 'CBC & diff',
    reticulocyteCount: 'Reticulocyte Count',
    dDimer: 'D-Dimer',
    fibrinogenLevel: 'Fibrinogen Level',
    ptInr: 'PT (INR)',
    pttAptt: 'PTT (APTT)',
  },
  chemistry: {
    lyte4: 'Electrolytes - Na, K, Cl, CO₂',
    creat: 'Creatinine + eGFR',
    urea: 'Urea',
    glucr: 'Glucose - Random',
    glucf: 'Glucose - FASTING',
    hma1c: 'Hemoglobin A1C',
    crcle: 'Est. Creatinine Clearance',
  },
  lipids: {
    trig: 'Triglyceride - FASTING',
    chol: 'Cholesterol - Total - FASTING',
    lipid: 'Chol, Trig, HDL, LDL - FASTING',
    ges1h: 'Gestational Challenge (50g) - Non Fasting',
    ges2h: 'Gestational Tolerance (75g) - FASTING',
    gtt2h: 'Glucose Tolerance (75g) - FASTING',
  },
  biochemistry: {
    alb: 'Albumin',
    ca: 'Calcium',
    phos: 'Phosphate',
    mg: 'Magnesium',
    uric: 'Uric Acid',
    alp: 'Alkaline Phosphatase',
    alt: 'Alanine Aminotransferase',
    ast: 'Aspartate Aminotransferase',
    ck: 'CK - Total',
    ld: 'Lactate Dehydrogenase',
    lip: 'Lipase',
    ggt: 'Gamma Glutamyltransferase',
    bilt: 'Bilirubin - Total',
    bilfr: 'Bilirubin - Fractionation',
    bhcg: 'BHCG (Quantitative - Level)',
    ironb: 'Iron and Total Iron Binding Capacity',
    fer: 'Ferritin',
    psa: 'Prostate Specific Antigen',
    thysa: 'Thyroid Stimulating Hormone',
    frt4: 'Free T4 (Free Thyroxine)',
    atpa: 'Thyroid Peroxidase Antibody',
    fshlh: 'Follicle Stimulating Hormone/Luteinizing Hormone',
    ediol: 'Estradiol',
    prge: 'Progesterone',
    prl: 'Prolactin',
    waser: 'Syphilis',
    hiv: 'HIV',
    crph: 'C-Reactive Protein-HS',
    rhf: 'Rheumatoid Factor',
    tnths: 'Troponin T HS',
    tp: 'Total Protein',
    pes: 'Serum Protein Electrophoresis',
    fitOccult: 'Stool for Fecal immunochemical test (Occult Blood)',
  },
  prenatal: {
    preim: 'Prenatal Screen',
    pblgp: 'Prenatal Group and Screen',
    paternalTest: 'Prenatal Group*, Phenotyping (Paternal Testing)',
  },
  urineTests: {
    ua: 'Voided Urinalysis',
    catheterizedUrinalysis: 'Catheterized Urinalysis',
    hcgu: 'HCG - Urine',
    clgp: 'Urine for Chlamydia and G.C. - First stream',
    albcr: 'Random Albumin/Creatinine Ratio (Microalbumin)'
  },
  urineCollection: {
    caud: 'Calcium',
    creud: 'Creatinine',
    crcl: 'Creatinine Clearance',
    crclc: 'Creatinine Clearance (BSA Corrected)',
    po4ud: 'Phosphate',
    tpud: 'Protein',
    peu: 'Protein Electrophoresis',
    nakud: 'Sodium / Potassium',
    ureud: 'Urea',
    uraud: 'Uric Acid',
  },
  hepatitis: {
    heppa: 'Acute viral hepatitis undefined etiology',
    hbchb: 'Hepatitis B (Hep B S Ab, Hep B S Ag, Hep Bc Tot Ab)',
    hcab: 'Hepatitis C (Hep C Ab)',
    haabt: 'Hepatitis A (Hep A Total Ab)',
    hbabs: 'Hepatitis B (Hep B S Ab)',
    cmva: 'Acute CMV (CMV IgM)',
    cmvi: 'Chronic or Past Exposure to CMV (CMV IgG)',
  },
  microbiology: {
    bloodCulture: 'Blood Culture',
    cervixSwab: 'Cervix Swab',
    sputum: 'Sputum',
    stool: 'Stool',
    throat: 'Throat',
    urethralSwab: 'Urethral Swab',
    urineCatheter: 'Urine - Catheter',
    urineMidstream: 'Urine - Midstream',
    vaginal: 'Vaginal',
    vagRectalSwab: 'Vaginal/Rectal Swab',
  },
} as const

// Helper function to get selected options with labels
function getSelectedOptions(values: Record<string, any>, labels: Record<string, string>) {
  if (!values || !labels) return []
  
  return Object.entries(labels)
    .filter(([key]) => values[key] === true)
    .map(([key, label]) => ({
      key,
      label: label || key
    }))
}

// Helper function to format date and time
function formatDateTime(date: string, time?: string) {
  if (!date) return 'Not specified'
  return `${format(new Date(date), 'MMM d, yyyy')}${time ? ` ${time}` : ''}`
}

export function BloodTestDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [test, setTest] = useState<BloodTestWithMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTest() {
      if (!id || !user) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await getBloodTest(id)
        setTest(data)
      } catch (error) {
        console.error('Error loading blood test:', error)
        setError('Failed to load blood test details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTest()
  }, [id, user])

  async function handleGeneratePdf() {
    if (!test) return

    try {
      toast.loading('Generating PDF...', { id: 'generate-pdf' })
      await generateBloodTestPdf({ test })
      toast.dismiss('generate-pdf')
      toast.success('PDF generated successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.dismiss('generate-pdf')
      toast.error('Failed to generate PDF', {
        description: error instanceof Error ? error.message : 'Please try again later'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">Blood test not found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/dashboard/history')}
              >
                View All Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if sections have selected tests
  const hasHematology = Object.values(test.hematology).some(value => value === true)
  const hasChemistry = Object.values(test.chemistry).some(value => typeof value === 'boolean' && value === true)
  const hasLipids = Object.values(test.lipids).some(value => value === true)
  const hasBiochemistry = Object.values(test.biochemistry).some(value => value === true)
  const hasTherapeuticDrugs = Object.values(test.therapeuticDrugs).some(value => value === true)
  const hasPrenatal = Object.values(test.prenatal).some(value => value === true)
  const hasUrineTests = Object.values(test.urineTests).some(value => value === true)
  const hasUrineCollection = Object.entries(test.urineCollection)
    .some(([key, value]) => 
      key !== 'startDate' && 
      key !== 'startTime' && 
      key !== 'endDate' && 
      key !== 'endTime' && 
      key !== 'height' && 
      key !== 'weight' && 
      value === true
    )
  const hasHepatitis = Object.values(test.hepatitis).some(value => value === true)
  const hasMicrobiology = Object.values(test.microbiology)
    .filter(value => typeof value === 'boolean')
    .some(value => value === true)

  console.log('🧪 Checking urine tests:', {
    hasUrineTests,
    hasUrineCollection,
    urineTests: test.urineTests,
    urineCollection: test.urineCollection
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <p className="text-sm text-muted-foreground">
          Created {format(new Date(test.createdAt), 'MMM d, yyyy')}
        </p>
      </div>

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Basic patient and collection details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
            <p className="font-medium">Name</p>
                <p>{test.patientInfo.firstName} {test.patientInfo.lastName}</p>
              </div>
              <div>
            <p className="font-medium">PHN</p>
            <p>{test.patientInfo.phn || 'Not provided'}</p>
              </div>
              <div>
            <p className="font-medium">Chart Number</p>
            <p>{test.patientInfo.chartNumber || 'Not provided'}</p>
              </div>
              <div>
            <p className="font-medium">Clinic Name</p>
            <p>{test.patientInfo.clinicName || 'Not provided'}</p>
              </div>
              <div>
            <p className="font-medium">Collection Date/Time</p>
            <p>{formatDateTime(test.patientInfo.collectionDate, test.patientInfo.collectionTime)}</p>
              </div>
              <div>
            <p className="font-medium">Requesting Physician</p>
            <p>{test.requestingPhysician.firstName} {test.requestingPhysician.lastName}</p>
              </div>
        </CardContent>
      </Card>

              {/* Hematology */}
      {hasHematology && (
        <Card>
          <CardHeader>
            <CardTitle>Hematology</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
                    {getSelectedOptions(test.hematology, TEST_LABELS.hematology).map(({ key, label }) => (
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
                    {getSelectedOptions(test.chemistry, TEST_LABELS.chemistry).map(({ key, label }) => (
                      <li key={key}>{label}</li>
                    ))}
              {test.chemistry.crcle && test.chemistry.weight && (
                      <li>Weight: {test.chemistry.weight} kg</li>
                    )}
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
                    {getSelectedOptions(test.lipids, TEST_LABELS.lipids).map(({ key, label }) => (
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
                    {getSelectedOptions(test.biochemistry, TEST_LABELS.biochemistry).map(({ key, label }) => (
                      <li key={key}>{label}</li>
                    ))}
                  </ul>
          </CardContent>
        </Card>
      )}

      {/* Therapeutic Drugs */}
      {hasTherapeuticDrugs && (
        <Card>
          <CardHeader>
            <CardTitle>Therapeutic Drugs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {getSelectedOptions(test.therapeuticDrugs, TEST_LABELS.therapeuticDrugs).map(({ key, label }) => (
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
                    {getSelectedOptions(test.prenatal, TEST_LABELS.prenatal).map(({ key, label }) => (
                      <li key={key}>{label}</li>
                    ))}
                  </ul>
          </CardContent>
        </Card>
              )}

              {/* Urine Tests */}
      {(hasUrineTests || hasUrineCollection) && (
        <Card>
          <CardHeader>
            <CardTitle>Urine Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Urine Tests */}
            {hasUrineTests && (
                <div>
                <h4 className="font-medium mb-2">Basic Urine Tests</h4>
                <ul className="list-disc pl-4">
                  {getSelectedOptions(test.urineTests, TEST_LABELS.urineTests).map(({ key, label }) => (
                      <li key={key}>{label}</li>
                  ))}
                  </ul>
                </div>
            )}

            {/* 24-Hour Urine Collection */}
            {hasUrineCollection && (
                <div>
                <h4 className="font-medium mb-2">24-Hour Urine Collection</h4>
                <div className="bg-muted/50 p-3 rounded-md mb-3">
                  <p><strong>Collection Period:</strong></p>
                  <p>Start: {formatDateTime(test.urineCollection.startDate, test.urineCollection.startTime)}</p>
                  <p>End: {formatDateTime(test.urineCollection.endDate, test.urineCollection.endTime)}</p>
                  {test.urineCollection.crclc && (
                    <div className="mt-2">
                      <p><strong>BSA Details:</strong></p>
                      <p>Height: {test.urineCollection.height} cm</p>
                      <p>Weight: {test.urineCollection.weight} kg</p>
                    </div>
                  )}
                </div>
                <ul className="list-disc pl-4">
                  {getSelectedOptions(test.urineCollection, TEST_LABELS.urineCollection).map(({ key, label }) => (
                      <li key={key}>{label}</li>
                    ))}
                  </ul>
                </div>
            )}
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
              {getSelectedOptions(test.hepatitis, TEST_LABELS.hepatitis).map(({ key, label }) => (
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
            <ul className="space-y-1">
              {formatMicrobiologyData(test.microbiology).map((item, index) => (
                <li key={index} className="whitespace-pre-wrap font-mono">{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Generate PDF Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Button
              onClick={handleGeneratePdf}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Generate PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 