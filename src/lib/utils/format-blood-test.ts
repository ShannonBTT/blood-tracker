export const MICROBIOLOGY_LABELS = {
  bloodCultureCAndS: 'Blood Culture - C & S',
  cervixSwabGC: 'Cervix Swab - G.C.',
  sputumCAndS: 'SPUTUM - C & S',
  sputumTBAfb: 'SPUTUM - TB/AFB',
  stoolCAndS: 'STOOL - C & S',
  stoolOAndP: 'STOOL - O & P',
  stoolCDiff: 'STOOL - CDIFF',
  throatCAndS: 'THROAT - C & S',
  urethralSwabGC: 'URETHRAL SWAB - G.C.',
  urineCatheterCAndS: 'Urine - Catheter - C & S',
  urineCatheterYeast: 'Urine - Catheter - YEAST',
  urineMidstreamCAndS: 'Urine - Midstream - C & S',
  urineMidstreamYeast: 'Urine - Midstream - YEAST',
  vaginalBV: 'VAGINAL - BV',
  vaginalTrich: 'VAGINAL - TRICH',
  groupBStrep: 'VAG/Rectal Swab - GROUP B STREP - PREGNANCY ONLY'
} as const

export function formatMicrobiologyData(microbiology: Record<string, any>): string[] {
  const results: string[] = []

  // Add checked tests with their human-readable labels
  Object.entries(microbiology).forEach(([key, value]) => {
    if (key === 'source' && value) {
      results.push(`Source/Site: ${value}`)
    } else if (key === 'source2' && value) {
      results.push(`Source/Site: ${value}`)
    } else if (key === 'otherTests' && value) {
      results.push(`Other Tests: ${value}`)
    } else if (key in MICROBIOLOGY_LABELS && value === true) {
      results.push(MICROBIOLOGY_LABELS[key as keyof typeof MICROBIOLOGY_LABELS])
    }
  })

  return results
} 