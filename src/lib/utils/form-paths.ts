import type { BloodTestForm } from '@/types/blood-test-form'
import type { Path } from 'react-hook-form'

type FormSection = keyof BloodTestForm
type SectionKey<T extends FormSection> = keyof BloodTestForm[T]

export function createPath<T extends FormSection>(
  section: T,
  field: SectionKey<T>
): Path<BloodTestForm> {
  return `${section}.${String(field)}` as Path<BloodTestForm>
} 