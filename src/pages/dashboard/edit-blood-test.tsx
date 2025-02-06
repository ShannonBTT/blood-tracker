import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { getBloodTest, updateBloodTest } from '@/lib/firebase/blood-tests'
import { useAuth } from '@/lib/contexts/auth-context'
import type { BloodTestForm } from '@/types/blood-test-form'
import { Skeleton } from '@/components/ui/skeleton'

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

export function EditBloodTestPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BloodTestForm>()

  useEffect(() => {
    async function loadBloodTest() {
      if (!id || !user) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await getBloodTest(id)
        
        if (!data) {
          setError('Blood test not found')
          return
        }

        // Pre-fill the form with existing data
        form.reset({
          patientInfo: data.patientInfo,
          requestingPhysician: data.requestingPhysician,
          therapeuticDrugs: data.therapeuticDrugs,
          hematology: data.hematology,
          chemistry: data.chemistry,
          lipids: data.lipids,
          biochemistry: data.biochemistry,
          prenatal: data.prenatal,
          urineTests: data.urineTests,
          urineCollection: data.urineCollection,
          hepatitis: data.hepatitis,
          microbiology: data.microbiology,
        })
      } catch (error) {
        console.error('Error loading blood test:', error)
        setError('Failed to load blood test. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadBloodTest()
  }, [id, user, form])

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
    if (!id || !user) {
      toast.error('Authentication Error', {
        description: 'You must be logged in to update a blood test'
      })
      return
    }

    setIsLoading(true)
    
    try {
      const formData = form.getValues()
      
      // Show loading toast
      toast.loading('Updating blood test...', {
        duration: Infinity,
        id: 'blood-test-update'
      })
      
      await updateBloodTest(id, {
        formData,
        updatedAt: new Date().toISOString()
      })

      // Dismiss loading toast and show success
      toast.dismiss('blood-test-update')
      toast.success('Blood test updated successfully!', {
        description: 'Redirecting to test history...'
      })
      
      // Add a small delay to show the success message
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate to the test history page
      navigate('/dashboard/history')
    } catch (error) {
      console.error('Error updating blood test:', error)
      
      // Dismiss loading toast and show error
      toast.dismiss('blood-test-update')
      toast.error('Failed to update blood test', {
        description: error instanceof Error 
          ? error.message 
          : 'Please check your connection and try again'
      })
    } finally {
      setIsLoading(false)
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
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/history')}
          >
            Back to History
          </Button>
        </CardContent>
      </Card>
    )
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Blood Test</h1>
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
              {currentStep === STEPS.length - 1 ? 'Update Blood Test' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 