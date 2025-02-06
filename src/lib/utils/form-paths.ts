import type { BloodTestForm } from '@/types/blood-test-form'
import type { Path } from 'react-hook-form'

export function createPath<T extends keyof BloodTestForm>(
  section: T,
  field: keyof BloodTestForm[T]
): Path<BloodTestForm> {
  return `${section}.${String(field)}` as Path<BloodTestForm>
} 