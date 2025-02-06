export interface PatientInfo {
  clinicName: string
  phn: string // Personal Health Number
  chartNumber: string
  lastName: string
  firstName: string
  gender: 'male' | 'female'
  dateOfBirth: string
  phone: string
}

export interface TherapeuticDrugTest {
  carbz: boolean // Carbamazepine (Tegretol)
  digi: boolean // Digoxin
  lith: boolean // Lithium
  phenb: boolean // Phenobarbital
  ptny: boolean // Phenytoin (Dilantin)
  valpr: boolean // Valproic Acid (Epival)
  cycl: boolean // Cyclosporin - Pre
  cy2: boolean // Cyclosporin - Post
  tacr: boolean // Tacrolimus - Pre
  siro: boolean // Sirolimus - Pre
  dosage?: string
  dateTime?: string
}

export interface HematologyTests {
  cbc: boolean // CBC
  cbcDiff: boolean // CBC & diff
  reticulocyteCount: boolean
  dDimer: boolean
  fibrinogenLevel: boolean
  ptInr: boolean // PT (INR)
  pttAptt: boolean // PTT (APTT)
}

export interface ChemistryTests {
  lyte4: boolean // Electrolytes - Na, K, Cl, CO₂
  creat: boolean // Creatinine + eGFR
  urea: boolean
  glucr: boolean // Glucose - Random
  glucf: boolean // Glucose - FASTING
  hma1c: boolean // Hemoglobin A1C
  crcle: boolean // Est. Creatinine Clearance
  weight: string // in kg
}

export interface LipidTests {
  trig: boolean // Triglyceride - FASTING
  chol: boolean // Cholesterol - Total - FASTING
  lipid: boolean // Chol, Trig, HDL, LDL - FASTING
  ges1h: boolean // Gestational Challenge (50g) - Non Fasting
  ges2h: boolean // Gestational Tolerance (75g) - FASTING
  gtt2h: boolean // Glucose Tolerance (75g) - FASTING
}

export interface BiochemistryTests {
  alb: boolean // Albumin
  ca: boolean // Calcium
  phos: boolean // Phosphate
  mg: boolean // Magnesium
  uric: boolean // Uric Acid
  alp: boolean // Alkaline Phosphatase
  alt: boolean // Alanine Aminotransferase
  ast: boolean // Aspartate Aminotransferase
  ck: boolean // CK - Total
  ld: boolean // Lactate Dehydrogenase
  lip: boolean // Lipase
  ggt: boolean // Gamma Glutamyltransferase
  bilt: boolean // Bilirubin - Total
  bilfr: boolean // Bilirubin - Fractionation
  bhcg: boolean // BHCG (Quantitative - Level)
  ironb: boolean // Iron and Total Iron Binding Capacity
  fer: boolean // Ferritin
  psa: boolean // Prostate Specific Antigen
  thysa: boolean // Thyroid Stimulating Hormone
  frt4: boolean // Free T4 (Free Thyroxine)
  atpa: boolean // Thyroid Peroxidase Antibody
  fshlh: boolean // Follicle Stimulating Hormone/Luteinizing Hormone
  ediol: boolean // Estradiol
  prge: boolean // Progesterone
  prl: boolean // Prolactin
  waser: boolean // Syphilis
  hiv: boolean // HIV
  crph: boolean // C-Reactive Protein-HS
  rhf: boolean // Rheumatoid Factor
  tnths: boolean // Troponin T HS
  tp: boolean // Total Protein
  pes: boolean // Serum Protein Electrophoresis
  fitOccult: boolean // Fecal Immunochemical Test (FIT) for Occult Blood
}

export interface PrenatalTests {
  preim: boolean // Prenatal Screen
  pblgp: boolean // Prenatal Group and Screen
  paternalTest: boolean // Prenatal Group*, Phenotyping (Paternal Testing)
}

export interface UrineTests {
  ua: boolean // Voided Urinalysis
  catheterizedUrinalysis: boolean // Catheterized Urinalysis
  hcgu: boolean // HCG - Urine
  clgp: boolean // Urine for Chlamydia and G.C. - First stream
  albcr: boolean // Random Albumin/Creatinine Ratio (Microalbumin)
}

export interface UrineCollection {
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  caud: boolean // Calcium
  creud: boolean // Creatinine
  crcl: boolean // Creatinine Clearance
  crclc: boolean // Creatinine Clearance (BSA Corrected)
  height?: number
  weight?: number
  po4ud: boolean // Phosphate
  tpud: boolean // Protein
  peu: boolean // Protein Electrophoresis
  nakud: boolean // Sodium / Potassium
  ureud: boolean // Urea
  uraud: boolean // Uric Acid
}

export interface HepatitisTests {
  heppa: boolean // Acute viral hepatitis undefined etiology
  hbchb: boolean // Hepatitis B (Hep B S Ab, Hep B S Ag, Hep Bc Tot Ab)
  hcab: boolean // Hepatitis C (Hep C Ab)
  haabt: boolean // Hepatitis A (Hep A Total Ab)
  hbabs: boolean // Hepatitis B (Hep B S Ab)
  cmva: boolean // Acute CMV (CMV IgM)
  cmvi: boolean // Chronic or Past Exposure to CMV (CMV IgG)
}

export interface MicrobiologyTests {
  // Sample types with their respective tests
  bloodCultureCAndS: boolean
  cervixSwabGC: boolean
  sputumCAndS: boolean
  sputumTBAfb: boolean
  stoolCAndS: boolean
  stoolOAndP: boolean
  stoolCDiff: boolean
  throatCAndS: boolean
  urethralSwabGC: boolean
  urineCatheterCAndS: boolean
  urineCatheterYeast: boolean
  urineMidstreamCAndS: boolean
  urineMidstreamYeast: boolean
  vaginalBV: boolean
  vaginalTrich: boolean
  groupBStrep: boolean
  
  // Text inputs
  source: string
  source2: string
  otherTests: string
}

export interface MicrobiologyData {
  collectionDate: string
  collectedBy: string
}

export interface BloodTestForm {
  patientInfo: {
    clinicName: string
    phn: string
    chartNumber: string
    lastName: string
    firstName: string
    collectionDate: string
    collectionTime: string
  }
  requestingPhysician: {
    firstName: string
    lastName: string
  }
  therapeuticDrugs: TherapeuticDrugTest
  hematology: HematologyTests
  chemistry: ChemistryTests
  lipids: LipidTests
  biochemistry: BiochemistryTests
  prenatal: PrenatalTests
  urineTests: UrineTests
  urineCollection: UrineCollection
  hepatitis: HepatitisTests
  microbiology: MicrobiologyTests
}

export interface BloodTest extends Omit<BloodTestForm, 'patientInfo' | 'requestingPhysician'> {
  id: string
  user_id: string
  clinic_name: string
  phn: string
  chart_number: string
  last_name: string
  first_name: string
  collection_date: string
  collection_time: string
  physician_first_name: string
  physician_last_name: string
  created_at: string
  status: 'draft' | 'completed'
} 