import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BloodTestForm } from '@/types/blood-test-form'

interface PatientInfoStepProps {
  form: UseFormReturn<BloodTestForm>
}

export function PatientInfoStep({ form }: PatientInfoStepProps) {
  const { register } = form

  return (
    <div className="space-y-6">
      {/* Clinic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="clinicName">Clinic Name</Label>
          <Input
            id="clinicName"
            {...register('patientInfo.clinicName')}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Patient Identification */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phn">PHN</Label>
          <Input
            id="phn"
            {...register('patientInfo.phn')}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="chartNumber">Chart Number</Label>
          <Input
            id="chartNumber"
            {...register('patientInfo.chartNumber')}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('patientInfo.lastName')}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register('patientInfo.firstName')}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Collection Date and Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="collectionDate">Collection Date</Label>
          <Input
            id="collectionDate"
            type="date"
            {...register('patientInfo.collectionDate')}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="collectionTime">Collection Time</Label>
          <Input
            id="collectionTime"
            type="time"
            {...register('patientInfo.collectionTime')}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Requesting Physician */}
      <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
        <div>
          <Label htmlFor="physicianFirstName">Requesting Physician First Name</Label>
          <Input
            id="physicianFirstName"
            {...register('requestingPhysician.firstName')}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="physicianLastName">Requesting Physician Last Name</Label>
          <Input
            id="physicianLastName"
            {...register('requestingPhysician.lastName')}
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  )
} 