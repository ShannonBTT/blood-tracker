export const TEST_LABELS = {
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
    cbc: 'CBC',
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
    fitOccult: 'Fecal Immunochemical Test (FIT) for Occult Blood',
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
    albcr: 'Random Albumin/Creatinine Ratio (Microalbumin)',
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
  // ... (other test labels)
} as const

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

export function formatTestData<T extends Record<string, boolean | string>>(
  data: T,
  labels: Record<string, string>
): string[] {
  return Object.entries(labels).map(([key, label]) => {
    const isChecked = data[key] === true
    return `${label} ${isChecked ? '☒' : '☐'}`
  })
}

export function formatTherapeuticDrugs(data: Record<string, any>): string[] {
  const results: string[] = []
  
  Object.entries(TEST_LABELS.therapeuticDrugs).forEach(([key, label]) => {
    results.push(`${label} ${data[key] ? '☒' : '☐'}`)
  })

  if (data.dosage) {
    results.push(`Dosage: ${data.dosage}`)
  }
  if (data.dateTime) {
    results.push(`Date/Time: ${data.dateTime}`)
  }

  return results
}

export function formatHematologyTests(data: Record<string, any>): string[] {
  return Object.entries(TEST_LABELS.hematology).map(([key, label]) => 
    `${label} ${data[key] ? '☒' : '☐'}`
  )
}

export function formatChemistryTests(data: Record<string, any>): string[] {
  const results = Object.entries(TEST_LABELS.chemistry).map(([key, label]) => 
    `${label} ${data[key] ? '☒' : '☐'}`
  )
  
  if (data.weight) {
    results.push(`Weight (kg): ${data.weight}`)
  }
  
  return results
}

export function formatLipidTests(data: Record<string, any>): string[] {
  return Object.entries(TEST_LABELS.lipids).map(([key, label]) => 
    `${label} ${data[key] ? '☒' : '☐'}`
  )
}

export function formatBiochemistryTests(data: Record<string, any>): string[] {
  return Object.entries(TEST_LABELS.biochemistry).map(([key, label]) => 
    `${label} ${data[key] ? '☒' : '☐'}`
  )
}

export function formatPrenatalTests(data: Record<string, any>): string[] {
  return Object.entries(TEST_LABELS.prenatal).map(([key, label]) => 
    `${label} ${data[key] ? '☒' : '☐'}`
  )
}

export function formatUrineTests(data: Record<string, any>): string[] {
  return Object.entries(TEST_LABELS.urineTests).map(([key, label]) => 
    `${label} ${data[key] ? '☒' : '☐'}`
  )
}

export function formatHepatitisTests(data: Record<string, any>): string[] {
  return Object.entries(TEST_LABELS.hepatitis).map(([key, label]) => 
    `${label} ${data[key] ? '☒' : '☐'}`
  )
}

export function formatMicrobiologyData(microbiology: Record<string, any>): string[] {
  const results: string[] = []

  // Blood Culture
  results.push(`Blood Culture ${microbiology.bloodCultureCAndS ? '☒' : '☐'} C & S`)

  // Cervix Swab
  results.push(`Cervix Swab ${microbiology.cervixSwabGC ? '☒' : '☐'} G.C.`)

  // Sputum
  results.push(`SPUTUM ${microbiology.sputumCAndS ? '☒' : '☐'} C & S ${microbiology.sputumTBAfb ? '☒' : '☐'} TB/AFB`)

  // Stool
  results.push(`STOOL ${microbiology.stoolCAndS ? '☒' : '☐'} C & S ${microbiology.stoolOAndP ? '☒' : '☐'} O & P ${microbiology.stoolCDiff ? '☒' : '☐'} CDIFF`)

  // Throat
  results.push(`THROAT ${microbiology.throatCAndS ? '☒' : '☐'} C & S`)

  // Urethral Swab
  results.push(`URETHRAL SWAB ${microbiology.urethralSwabGC ? '☒' : '☐'} G.C.`)

  // Urine - Catheter
  results.push(`Urine - Catheter ${microbiology.urineCatheterCAndS ? '☒' : '☐'} C & S ${microbiology.urineCatheterYeast ? '☒' : '☐'} YEAST`)

  // Source
  if (microbiology.source) {
    results.push(`Source/Site: ${microbiology.source}`)
  }

  // Urine - Midstream
  results.push(`Urine - Midstream ${microbiology.urineMidstreamCAndS ? '☒' : '☐'} C & S ${microbiology.urineMidstreamYeast ? '☒' : '☐'} YEAST`)

  // Vaginal
  results.push(`VAGINAL ${microbiology.vaginalBV ? '☒' : '☐'} BV ${microbiology.vaginalTrich ? '☒' : '☐'} TRICH`)

  // VAG/Rectal Swab
  results.push(`VAG/Rectal Swab ${microbiology.groupBStrep ? '☒' : '☐'} GROUP B STREP - PREGNANCY ONLY`)

  // Other Tests
  if (microbiology.otherTests) {
    results.push(`OTHER TEST: ${microbiology.otherTests}`)
  }

  // Source 2
  if (microbiology.source2) {
    results.push(`Source/Site: ${microbiology.source2}`)
  }

  return results
} 