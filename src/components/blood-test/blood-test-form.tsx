import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { onAuthStateChanged } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PatientInfoStep } from './steps/patient-info-step'
import { TherapeuticDrugsStep } from './steps/therapeutic-drugs-step'
import { HematologyStep } from './steps/hematology-step'
import { ChemistryStep } from './steps/chemistry-step'
import { LipidsStep } from './steps/lipids-step'
import { BiochemistryStep } from './steps/biochemistry-step'
import { PrenatalStep } from './steps/prenatal-step'
import { UrineTestsStep } from './steps/urine-tests-step'
import { HepatitisStep } from './steps/hepatitis-step'
import { MicrobiologyStep } from './steps/microbiology-step'
import { ReviewStep } from './steps/review-step'
import { createBloodTest } from '@/lib/firebase/blood-tests'
import { auth } from '@/lib/firebase'
import type { BloodTestForm } from '@/types/blood-test-form'
import React from 'react'

const STEPS = [
  { id: 'patientInfo', label: 'Patient Information' },
  { id: 'therapeuticDrugs', label: 'Therapeutic Drugs' },
  { id: 'hematology', label: 'Hematology' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'lipids', label: 'Lipids' },
  { id: 'biochemistry', label: 'Biochemistry' },
  { id: 'prenatal', label: 'Prenatal' },
  { id: 'urineTests', label: 'Urine Tests' },
  { id: 'hepatitis', label: 'Hepatitis' },
  { id: 'microbiology', label: 'Microbiology' },
  { id: 'review', label: 'Review' },
] as const

export function BloodTestForm() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  
  const form = useForm<BloodTestForm>({
    defaultValues: {
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
        bloodCultureCAndS: false,
        cervixSwabGC: false,
        sputumCAndS: false,
        sputumTBAfb: false,
        stoolCAndS: false,
        stoolOAndP: false,
        stoolCDiff: false,
        throatCAndS: false,
        urethralSwabGC: false,
        urineCatheterCAndS: false,
        urineCatheterYeast: false,
        urineMidstreamCAndS: false,
        urineMidstreamYeast: false,
        vaginalBV: false,
        vaginalTrich: false,
        groupBStrep: false,
        source: '',
        source2: '',
        otherTests: ''
      },
    }
  })

  // Get the current user on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const subscription = form.watch(() => {
      // Remove form state change logging
    })
    return () => subscription.unsubscribe()
  }, [form])

  function validateForm(formData: BloodTestForm) {
    const errors: string[] = []

    // Validate patient info
    if (!formData.patientInfo.clinicName) errors.push('Clinic Name is required')
    if (!formData.patientInfo.phn) errors.push('PHN is required')
    if (!formData.patientInfo.chartNumber) errors.push('Chart Number is required')
    if (!formData.patientInfo.lastName) errors.push('Last Name is required')
    if (!formData.patientInfo.firstName) errors.push('First Name is required')
    if (!formData.patientInfo.collectionDate) errors.push('Collection Date is required')

    // Validate at least one test is selected
    const hasAnyTest = [
      formData.therapeuticDrugs,
      formData.hematology,
      formData.chemistry,
      formData.lipids,
      formData.biochemistry,
      formData.prenatal,
      formData.urineTests,
      formData.hepatitis,
      formData.microbiology
    ].some(section => 
      Object.values(section)
        .filter(value => typeof value === 'boolean')
        .some(value => value)
    )

    if (!hasAnyTest) errors.push('At least one test must be selected')

    return errors
  }

  const handleFormSubmit = React.useCallback(async () => {
    if (isSubmitting) return

    const formData = form.getValues()
    console.log('Form values:', formData)

    // Reset states
    setSubmitError(null)
    setSubmitSuccess(null)

    const validationErrors = validateForm(formData)
    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.join('\n')
      setSubmitError(errorMessage)
      toast.error('Validation Error', {
        description: errorMessage,
        duration: 5000,
      })
      return
    }

    if (!user) {
      const error = 'You must be logged in to create a blood test'
      setSubmitError(error)
      toast.error('Authentication Error', {
        description: error,
        duration: 5000,
      })
      return
    }

    try {
      setIsSubmitting(true)

      const result = await createBloodTest({
        userId: user.uid,
        formData
      })

      if (!result) {
        throw new Error('Failed to create blood test - no response from server')
      }

      const successMessage = 'Blood test created successfully!'
      setSubmitSuccess(successMessage)
      toast.success('Success', {
        description: successMessage,
        duration: 5000,
      })
      
      // Add a small delay to show the success message
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to the blood tests list
      navigate('/blood-tests')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      console.error('Error submitting form:', error)
      setSubmitError(message)
      toast.error('Error', {
        description: message,
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [form, user, isSubmitting, navigate])

  function validateCurrentStep(): { isValid: boolean; errors: string[] } {
    const formData = form.getValues()
    const errors: string[] = []

    switch (currentStep) {
      case 0: // Patient Information
        if (!formData.patientInfo.clinicName) errors.push('Clinic Name is required')
        if (!formData.patientInfo.phn) errors.push('PHN is required')
        if (!formData.patientInfo.chartNumber) errors.push('Chart Number is required')
        if (!formData.patientInfo.lastName) errors.push('Last Name is required')
        if (!formData.patientInfo.firstName) errors.push('First Name is required')
        if (!formData.patientInfo.collectionDate) errors.push('Collection Date is required')
        if (!formData.requestingPhysician.firstName) errors.push('Physician First Name is required')
        if (!formData.requestingPhysician.lastName) errors.push('Physician Last Name is required')
        break

      case 1: // Therapeutic Drugs
        const hasTherapeuticDrugs = Object.values(formData.therapeuticDrugs)
          .filter(value => typeof value === 'boolean')
          .some(value => value === true)
        if (!hasTherapeuticDrugs) errors.push('Please select at least one therapeutic drug test')
        break

      case 2: // Hematology
        const hasHematology = Object.values(formData.hematology).some(value => value === true)
        if (!hasHematology) errors.push('Please select at least one hematology test')
        break

      case 3: // Chemistry
        const hasChemistry = Object.values(formData.chemistry)
          .filter(value => typeof value === 'boolean')
          .some(value => value === true)
        if (!hasChemistry) errors.push('Please select at least one chemistry test')
        // Validate weight if creatinine clearance is selected
        if (formData.chemistry.crcle && !formData.chemistry.weight) {
          errors.push('Weight is required when Creatinine Clearance is selected')
        }
        break

      case 4: // Lipids
        const hasLipids = Object.values(formData.lipids).some(value => value === true)
        if (!hasLipids) errors.push('Please select at least one lipids test')
        break

      case 5: // Biochemistry
        const hasBiochemistry = Object.values(formData.biochemistry).some(value => value === true)
        if (!hasBiochemistry) errors.push('Please select at least one biochemistry test')
        break

      case 6: // Prenatal
        const hasPrenatal = Object.values(formData.prenatal).some(value => value === true)
        if (!hasPrenatal) errors.push('Please select at least one prenatal test')
        break

      case 7: // Urine Tests
        const hasUrineTests = Object.values(formData.urineTests).some(value => value === true)
        const hasUrineCollection = Object.values(formData.urineCollection)
          .filter(value => typeof value === 'boolean')
          .some(value => value === true)
        
        if (!hasUrineTests && !hasUrineCollection) {
          errors.push('Please select at least one urine test or collection test')
        }

        // Validate collection dates and times if any collection test is selected
        if (hasUrineCollection) {
          if (!formData.urineCollection.startDate) errors.push('Collection Start Date is required')
          if (!formData.urineCollection.startTime) errors.push('Collection Start Time is required')
          if (!formData.urineCollection.endDate) errors.push('Collection End Date is required')
          if (!formData.urineCollection.endTime) errors.push('Collection End Time is required')
          
          // Validate height and weight if BSA Corrected is selected
          if (formData.urineCollection.crclc) {
            if (!formData.urineCollection.height) errors.push('Height is required for BSA Corrected')
            if (!formData.urineCollection.weight) errors.push('Weight is required for BSA Corrected')
          }
        }
        break

      case 8: // Hepatitis
        const hasHepatitis = Object.values(formData.hepatitis).some(value => value === true)
        if (!hasHepatitis) errors.push('Please select at least one hepatitis test')
        break

      case 9: // Microbiology
        const hasMicrobiology = Object.values(formData.microbiology)
          .filter(value => typeof value === 'boolean')
          .some(value => value === true)
        if (!hasMicrobiology) errors.push('Please select at least one microbiology test')
        
        // If any test is selected, source is required
        if (hasMicrobiology && !formData.microbiology.source) {
          errors.push('Source/Site is required when selecting microbiology tests')
        }
        break

      case 10: // Review
        // No validation needed for review step
        break
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  function handleNext() {
    const { isValid, errors } = validateCurrentStep()
    
    if (!isValid) {
      setSubmitError(errors.join('\n'))
      toast.error('Please fill in all required fields', {
        description: errors.join('\n')
      })
      return
    }

    setSubmitError(null)
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(step => step + 1)
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1)
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{STEPS[currentStep].label}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Status Messages */}
      {submitError && (
        <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Error submitting form:</p>
          <p>{submitError}</p>
        </div>
      )}

      {submitSuccess && (
        <div className="p-4 border border-green-500 bg-green-50 text-green-700 rounded-md">
          <p className="font-medium">Success!</p>
          <p>{submitSuccess}</p>
        </div>
      )}

      {isSubmitting && (
        <div className="p-4 border border-blue-500 bg-blue-50 text-blue-700 rounded-md">
          <p className="font-medium">Submitting...</p>
          <p>Please wait while we save your blood test data.</p>
        </div>
      )}

      {/* Form */}
      <form 
        onSubmit={async (e) => {
          e.preventDefault()
          if (currentStep === STEPS.length - 1) {
            await handleFormSubmit()
          } else {
            handleNext()
          }
        }}
        className="space-y-6"
      >
        {/* Step Content */}
        {currentStep === 0 && <PatientInfoStep form={form} />}
        {currentStep === 1 && <TherapeuticDrugsStep form={form} />}
        {currentStep === 2 && <HematologyStep form={form} />}
        {currentStep === 3 && <ChemistryStep form={form} />}
        {currentStep === 4 && <LipidsStep form={form} />}
        {currentStep === 5 && <BiochemistryStep form={form} />}
        {currentStep === 6 && <PrenatalStep form={form} />}
        {currentStep === 7 && <UrineTestsStep form={form} />}
        {currentStep === 8 && <HepatitisStep form={form} />}
        {currentStep === 9 && <MicrobiologyStep form={form} />}
        {currentStep === 10 && (
          <ReviewStep 
            form={form} 
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        
        {/* Navigation */}
        <div className="space-y-4">
        <div className="flex justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
          >
            Back
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Blood Test'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
} 