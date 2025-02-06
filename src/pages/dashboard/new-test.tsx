import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PatientInfoStep } from '@/components/blood-test/steps/patient-info-step'
import { TherapeuticDrugsStep } from '@/components/blood-test/steps/therapeutic-drugs-step'
import { HematologyStep } from '@/components/blood-test/steps/hematology-step'
import { ChemistryStep } from '@/components/blood-test/steps/chemistry-step'
import { LipidsStep } from '@/components/blood-test/steps/lipids-step'
import { BiochemistryStep } from '@/components/blood-test/steps/biochemistry-step'
import { PrenatalStep } from '@/components/blood-test/steps/prenatal-step'
import { UrineTestsStep } from '@/components/blood-test/steps/urine-tests-step'
import { HepatitisStep } from '@/components/blood-test/steps/hepatitis-step'
import { MicrobiologyStep } from '@/components/blood-test/steps/microbiology-step'
import { ReviewStep } from '@/components/blood-test/steps/review-step'
import { createBloodTest } from '@/lib/firebase/blood-tests'
import { useAuth } from '@/lib/contexts/auth-context'
import type { BloodTestForm } from '@/types/blood-test-form'

const STEPS = [
  'Patient Information',
  'Hematology',
  'Chemistry',
  'Lipids',
  'Biochemistry',
  'Therapeutic Drugs',
  'Prenatal',
  'Urine Tests',
  'Hepatitis',
  'Microbiology',
  'Review'
] as const

const defaultValues: BloodTestForm = {
  patientInfo: {
    clinicName: '',
    phn: '',
    chartNumber: '',
    lastName: '',
    firstName: '',
    collectionDate: '',
    collectionTime: '',
  },
  requestingPhysician: {
    firstName: '',
    lastName: '',
  },
  therapeuticDrugs: {
    carbz: false,
    digi: false,
    lith: false,
    phenb: false,
    ptny: false,
    valpr: false,
    cycl: false,
    cy2: false,
    tacr: false,
    siro: false,
  },
  hematology: {
    cbcDiff: false,
    reticulocyteCount: false,
    dDimer: false,
    fibrinogenLevel: false,
    ptInr: false,
    pttAptt: false,
  },
  chemistry: {
    lyte4: false,
    creat: false,
    urea: false,
    glucr: false,
    glucf: false,
    hma1c: false,
    crcle: false,
    weight: '',
  },
  lipids: {
    trig: false,
    chol: false,
    lipid: false,
    ges1h: false,
    ges2h: false,
    gtt2h: false,
  },
  biochemistry: {
    alb: false,
    ca: false,
    phos: false,
    mg: false,
    uric: false,
    alp: false,
    alt: false,
    ast: false,
    ck: false,
    ld: false,
    lip: false,
    ggt: false,
    bilt: false,
    bilfr: false,
    bhcg: false,
    ironb: false,
    fer: false,
    psa: false,
    thysa: false,
    frt4: false,
    atpa: false,
    fshlh: false,
    ediol: false,
    prge: false,
    prl: false,
    waser: false,
    hiv: false,
    crph: false,
    rhf: false,
    tnths: false,
    tp: false,
    pes: false,
    fitOccult: false,
  },
  prenatal: {
    preim: false,
    pblgp: false,
    paternalTest: false,
  },
  urineTests: {
    ua: false,
    catheterizedUrinalysis: false,
    hcgu: false,
    clgp: false,
    albcr: false,
  },
  urineCollection: {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    caud: false,
    creud: false,
    crcl: false,
    crclc: false,
    po4ud: false,
    tpud: false,
    peu: false,
    nakud: false,
    ureud: false,
    uraud: false,
  },
  hepatitis: {
    heppa: false,
    hbchb: false,
    hcab: false,
    haabt: false,
    hbabs: false,
    cmva: false,
    cmvi: false,
  },
  microbiology: {
    bloodCulture: false,
    cervixSwab: false,
    sputum: false,
    stool: false,
    throat: false,
    urethralSwab: false,
    urineCatheter: false,
    urineMidstream: false,
    vaginal: false,
    vagRectalSwab: false,
    source: '',
    otherTests: '',
  },
}

export function NewBloodTestPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BloodTestForm>({
    defaultValues,
  })

  function handleNext() {
    const isLastStep = currentStep === STEPS.length - 1
    if (isLastStep) {
      handleSubmit()
      return
    }
    setCurrentStep(step => step + 1)
  }

  function handleBack() {
    setCurrentStep(step => step - 1)
  }

  async function handleSubmit() {
    console.log('🚀 handleSubmit triggered')
    
    if (!user) {
      console.error('❌ No user found')
      toast.error('Authentication Error', {
        description: 'You must be logged in to create a blood test'
      })
      return
    }

    console.log('👤 User authenticated:', user.uid)
    setIsLoading(true)
    
    try {
      const formData = form.getValues()
      console.log('📝 Form data collected:', JSON.stringify(formData, null, 2))
      
      // Validate required fields
      if (!formData.patientInfo.clinicName || 
          !formData.patientInfo.phn || 
          !formData.patientInfo.lastName || 
          !formData.patientInfo.firstName) {
        throw new Error('Please fill in all required patient information')
      }
      
      // Show loading toast
      console.log('⏳ Showing loading toast')
      toast.loading('Creating blood test...', {
        duration: Infinity,
        id: 'blood-test-submit'
      })
      
      console.log('💾 Calling createBloodTest...')
      const result = await createBloodTest({
        userId: user.uid,
        formData
      })

      if (!result) {
        throw new Error('Failed to create blood test - no response from server')
      }

      console.log('✅ Blood test created successfully:', result)
      
      // Dismiss loading toast and show success
      toast.dismiss('blood-test-submit')
      toast.success('Blood test created successfully!', {
        description: 'Redirecting to test history...'
      })
      
      // Add a small delay to show the success message
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('🔄 Navigating to history page...')
      // Navigate to the test history page
      navigate('/dashboard/history')
    } catch (error) {
      console.error('❌ Error submitting form:', error)
      
      // Dismiss loading toast and show error
      toast.dismiss('blood-test-submit')
      toast.error('Failed to create blood test', {
        description: error instanceof Error 
          ? error.message 
          : 'Please check your connection and try again'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Blood Test</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </p>
        </div>
        <div className="hidden sm:block text-sm text-muted-foreground">
          {Math.round(progress)}% complete
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{STEPS[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="min-h-[400px]">
            {currentStep === 0 && <PatientInfoStep form={form} />}
            {currentStep === 1 && <HematologyStep form={form} />}
            {currentStep === 2 && <ChemistryStep form={form} />}
            {currentStep === 3 && <LipidsStep form={form} />}
            {currentStep === 4 && <BiochemistryStep form={form} />}
            {currentStep === 5 && <TherapeuticDrugsStep form={form} />}
            {currentStep === 6 && <PrenatalStep form={form} />}
            {currentStep === 7 && <UrineTestsStep form={form} />}
            {currentStep === 8 && <HepatitisStep form={form} />}
            {currentStep === 9 && <MicrobiologyStep form={form} />}
            {currentStep === 10 && (
              <ReviewStep 
                form={form}
                onSubmit={handleSubmit}
                isSubmitting={isLoading}
              />
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isLoading}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {currentStep === STEPS.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 