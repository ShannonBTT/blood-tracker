import { BloodTestHistory } from '@/components/blood-test/blood-test-history'
import { useState } from 'react'

export function TestHistory() {
  const [testCount, setTestCount] = useState<number>(0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Blood Test History
          <span className="ml-2 text-lg font-normal text-muted-foreground">
            ({testCount} {testCount === 1 ? 'test' : 'tests'})
          </span>
        </h1>
      </div>
      <BloodTestHistory onCountChange={setTestCount} />
    </div>
  )
} 