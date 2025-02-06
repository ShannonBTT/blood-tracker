import jsPDF from 'jspdf'
import { format } from 'date-fns'
import type { BloodTestForm } from '@/types/blood-test-form'

interface GeneratePdfParams {
  test: BloodTestForm & {
    id: string
    createdAt: string
    status: string
  }
}

export function generateBloodTestPdf({ test }: GeneratePdfParams) {
  if (!test) {
    throw new Error('Test data is required')
  }

  // Initialize PDF in portrait mode with millimeters
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Set consistent margins and dimensions
  const pageWidth = doc.internal.pageSize.width // 210mm for A4
  const pageHeight = doc.internal.pageSize.height // 297mm for A4
  const margin = {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
  }
  const contentWidth = pageWidth - margin.left - margin.right

  // Track current Y position
  let currentY = margin.top
  let currentPage = 1

  // Helper function to check if we need a new page
  function checkNewPage(requiredSpace: number) {
    if (currentY + requiredSpace > pageHeight - margin.bottom) {
      doc.addPage()
      currentPage++
      currentY = margin.top
      return true
    }
    return false
  }

  // Helper function to draw a box with optional fill
  function drawBox(x: number, y: number, width: number, height: number, style: 'stroke' | 'fill' = 'stroke') {
    if (style === 'fill') {
      doc.setFillColor(240, 240, 240)
      doc.rect(x, y, width, height, 'F')
    } else {
      doc.rect(x, y, width, height)
    }
  }

  // Helper function to safely check if a test is selected
  function isTestSelected(section: keyof BloodTestForm, key: string): boolean {
    if (!test[section] || typeof test[section] !== 'object') return false
    
    // Handle special cases for sections with additional fields
    if (section === 'therapeuticDrugs') {
      if (key === 'dosage') return Boolean(test.therapeuticDrugs.dosage)
      if (key === 'dateTime') return Boolean(test.therapeuticDrugs.dateTime)
    }
    
    if (section === 'chemistry') {
      if (key === 'weight') return Boolean(test.chemistry.weight)
    }
    
    if (section === 'urineCollection') {
      if (['startDate', 'startTime', 'endDate', 'endTime', 'height', 'weight'].includes(key)) {
        return Boolean((test.urineCollection as any)[key])
      }
    }
    
    if (section === 'microbiology') {
      if (['source', 'source2', 'otherTests'].includes(key)) {
        return Boolean((test.microbiology as any)[key])
      }
    }
    
    // Handle boolean test selections by first converting to unknown
    const sectionData = test[section] as unknown as Record<string, unknown>
    return Boolean(sectionData[key])
  }

  // Helper function to add checkbox items with better alignment
  function addCheckboxItem(text: string, checked: boolean, x: number, y: number) {
    const boxSize = 3
    doc.setLineWidth(0.2)
    doc.rect(x, y - 3, boxSize, boxSize)
    
    if (checked) {
      doc.setLineWidth(0.3)
      doc.line(x + 0.5, y - 2.5, x + boxSize - 0.5, y - 0.5)
      doc.line(x + 0.5, y - 0.5, x + boxSize - 0.5, y - 2.5)
      doc.setLineWidth(0.2)
    }
    
    doc.text(text, x + boxSize + 2, y)
  }

  // Helper function for section titles
  function addSectionTitle(text: string, x: number, y: number) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(text, x, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
  }

  // Patient Information Section
  doc.setFontSize(10)
  doc.text('Clinic name:', margin.left + 5, currentY)
  doc.text(test.patientInfo.clinicName || '', margin.left + 30, currentY)

  currentY += 8
  doc.text('PHN:', margin.left + 5, currentY)
  doc.text(test.patientInfo.phn || '', margin.left + 30, currentY)

  currentY += 8
  doc.text('Name:', margin.left + 5, currentY)
  doc.text(`${test.patientInfo.lastName}, ${test.patientInfo.firstName}`, margin.left + 30, currentY)

  currentY += 8
  doc.text('Collection Date:', margin.left + 5, currentY)
  doc.text(test.patientInfo.collectionDate || '', margin.left + 40, currentY)
  doc.text('Time:', margin.left + 80, currentY)
  doc.text(test.patientInfo.collectionTime || '', margin.left + 95, currentY)

  currentY += 8
  doc.text('Requesting Physician:', margin.left + 5, currentY)
  doc.text(`${test.requestingPhysician.lastName}, ${test.requestingPhysician.firstName}`, margin.left + 50, currentY)

  // Start test sections
  currentY += 15

  // Hematology Section
  addSectionTitle('HEMATOLOGY', margin.left + 5, currentY)
  currentY += 8

  const hematologyTests = [
    { key: 'cbcDiff', label: 'CBC & diff' },
    { key: 'reticulocyteCount', label: 'Reticulocyte Count' },
    { key: 'dDimer', label: 'D-Dimer' },
    { key: 'fibrinogenLevel', label: 'Fibrinogen Level' },
    { key: 'ptInr', label: 'PT (INR)' },
    { key: 'pttAptt', label: 'PTT (APTT)' }
  ]

  hematologyTests.forEach(item => {
    if (checkNewPage(8)) {
      addSectionTitle('HEMATOLOGY (continued)', margin.left + 5, currentY)
      currentY += 8
    }
    addCheckboxItem(item.label, isTestSelected('hematology', item.key), margin.left + 5, currentY)
    currentY += 6
  })

  // Chemistry Section
  currentY += 8
  if (checkNewPage(50)) {
    addSectionTitle('CHEMISTRY', margin.left + 5, currentY)
    currentY += 8
  }

  const chemistryTests = [
    { key: 'lyte4', label: 'Electrolytes - Na, K, Cl, CO₂' },
    { key: 'creat', label: 'Creatinine + eGFR' },
    { key: 'urea', label: 'Urea' },
    { key: 'glucr', label: 'Glucose - Random' },
    { key: 'glucf', label: 'Glucose - FASTING' },
    { key: 'hma1c', label: 'Hemoglobin A1C' },
    { key: 'crcle', label: 'Est. Creatinine Clearance' }
  ]

  chemistryTests.forEach(item => {
    if (checkNewPage(8)) {
      addSectionTitle('CHEMISTRY (continued)', margin.left + 5, currentY)
      currentY += 8
    }
    addCheckboxItem(item.label, isTestSelected('chemistry', item.key), margin.left + 5, currentY)
    currentY += 6
  })

  // Lipids Section
  currentY += 8
  if (checkNewPage(50)) {
    addSectionTitle('LIPIDS', margin.left + 5, currentY)
    currentY += 8
  }

  const lipidTests = [
    { key: 'trig', label: 'Triglyceride - FASTING' },
    { key: 'chol', label: 'Cholesterol - Total - FASTING' },
    { key: 'lipid', label: 'Chol, Trig, HDL, LDL - FASTING' },
    { key: 'ges1h', label: 'Gestational Challenge (50g) - Non Fasting' },
    { key: 'ges2h', label: 'Gestational Tolerance (75g) - FASTING' },
    { key: 'gtt2h', label: 'Glucose Tolerance (75g) - FASTING' }
  ]

  lipidTests.forEach(item => {
    if (checkNewPage(8)) {
      addSectionTitle('LIPIDS (continued)', margin.left + 5, currentY)
      currentY += 8
    }
    addCheckboxItem(item.label, isTestSelected('lipids', item.key), margin.left + 5, currentY)
    currentY += 6
  })

  // Biochemistry Section
  currentY += 8
  if (checkNewPage(50)) {
    addSectionTitle('BIOCHEMISTRY', margin.left + 5, currentY)
    currentY += 8
  }

  const biochemistryTests = [
    { key: 'alb', label: 'Albumin' },
    { key: 'ca', label: 'Calcium' },
    { key: 'phos', label: 'Phosphate' },
    { key: 'mg', label: 'Magnesium' },
    { key: 'uric', label: 'Uric Acid' },
    { key: 'alp', label: 'Alkaline Phosphatase' },
    { key: 'alt', label: 'Alanine Aminotransferase' },
    { key: 'ast', label: 'Aspartate Aminotransferase' },
    { key: 'ck', label: 'CK - Total' },
    { key: 'ld', label: 'Lactate Dehydrogenase' },
    { key: 'lip', label: 'Lipase' },
    { key: 'ggt', label: 'Gamma Glutamyltransferase' },
    { key: 'bilt', label: 'Bilirubin - Total' },
    { key: 'bilfr', label: 'Bilirubin - Fractionation' },
    { key: 'bhcg', label: 'BHCG (Quantitative - Level)' },
    { key: 'ironb', label: 'Iron and Total Iron Binding Capacity' },
    { key: 'fer', label: 'Ferritin' },
    { key: 'psa', label: 'Prostate Specific Antigen' },
    { key: 'thysa', label: 'Thyroid Stimulating Hormone' },
    { key: 'frt4', label: 'Free T4 (Free Thyroxine)' },
    { key: 'atpa', label: 'Thyroid Peroxidase Antibody' },
    { key: 'fshlh', label: 'Follicle Stimulating Hormone/Luteinizing Hormone' },
    { key: 'ediol', label: 'Estradiol' },
    { key: 'prge', label: 'Progesterone' },
    { key: 'prl', label: 'Prolactin' },
    { key: 'waser', label: 'Syphilis' },
    { key: 'hiv', label: 'HIV' },
    { key: 'crph', label: 'C-Reactive Protein-HS' },
    { key: 'rhf', label: 'Rheumatoid Factor' },
    { key: 'tnths', label: 'Troponin T HS' },
    { key: 'tp', label: 'Total Protein' },
    { key: 'pes', label: 'Serum Protein Electrophoresis' },
    { key: 'fitOccult', label: 'Fecal Immunochemical Test (FIT) for Occult Blood' }
  ]

  biochemistryTests.forEach(item => {
    if (checkNewPage(8)) {
      addSectionTitle('BIOCHEMISTRY (continued)', margin.left + 5, currentY)
      currentY += 8
    }
    addCheckboxItem(item.label, isTestSelected('biochemistry', item.key), margin.left + 5, currentY)
    currentY += 6
  })

  // Therapeutic Drugs Section with Dosage and Time
  currentY += 8
  if (checkNewPage(50)) {
    addSectionTitle('THERAPEUTIC DRUGS', margin.left + 5, currentY)
    currentY += 8
  }

  const therapeuticTests = [
    { key: 'carbz', label: 'Carbamazepine (Tegretol)' },
    { key: 'digi', label: 'Digoxin' },
    { key: 'lith', label: 'Lithium' },
    { key: 'phenb', label: 'Phenobarbital' },
    { key: 'ptny', label: 'Phenytoin (Dilantin)' },
    { key: 'valpr', label: 'Valproic Acid (Epival)' },
    { key: 'cycl', label: 'Cyclosporin - Pre' },
    { key: 'cy2', label: 'Cyclosporin - Post' },
    { key: 'tacr', label: 'Tacrolimus - Pre' },
    { key: 'siro', label: 'Sirolimus - Pre' }
  ]

  therapeuticTests.forEach(item => {
    if (checkNewPage(12)) {
      addSectionTitle('THERAPEUTIC DRUGS (continued)', margin.left + 5, currentY)
      currentY += 8
    }
    addCheckboxItem(item.label, isTestSelected('therapeuticDrugs', item.key), margin.left + 5, currentY)
    
    // Add dosage and time if test is selected
    if (isTestSelected('therapeuticDrugs', item.key)) {
      doc.text('Dosage:', margin.left + 100, currentY)
      doc.text(test.therapeuticDrugs.dosage || '', margin.left + 120, currentY)
      doc.text('Time:', margin.left + 150, currentY)
      doc.text(test.therapeuticDrugs.dateTime || '', margin.left + 165, currentY)
    }
    currentY += 6
  })

  // Urine Collection Section
  currentY += 8
  if (checkNewPage(50)) {
    addSectionTitle('24-HOUR URINE COLLECTION', margin.left + 5, currentY)
    currentY += 8
  }

  // Add collection period
  doc.text('Collection Period:', margin.left + 5, currentY)
  currentY += 6
  doc.text('Start:', margin.left + 5, currentY)
  doc.text(`Date: ${test.urineCollection.startDate || ''}`, margin.left + 20, currentY)
  doc.text(`Time: ${test.urineCollection.startTime || ''}`, margin.left + 80, currentY)
  currentY += 6
  doc.text('End:', margin.left + 5, currentY)
  doc.text(`Date: ${test.urineCollection.endDate || ''}`, margin.left + 20, currentY)
  doc.text(`Time: ${test.urineCollection.endTime || ''}`, margin.left + 80, currentY)
  currentY += 8

  const urineCollectionTests = [
    { key: 'caud', label: 'Calcium' },
    { key: 'creud', label: 'Creatinine' },
    { key: 'crcl', label: 'Creatinine Clearance' },
    { key: 'crclc', label: 'Creatinine Clearance (BSA Corrected)' },
    { key: 'po4ud', label: 'Phosphate' },
    { key: 'tpud', label: 'Protein' },
    { key: 'peu', label: 'Protein Electrophoresis' },
    { key: 'nakud', label: 'Sodium / Potassium' },
    { key: 'ureud', label: 'Urea' },
    { key: 'uraud', label: 'Uric Acid' }
  ]

  urineCollectionTests.forEach(item => {
    if (checkNewPage(8)) {
      addSectionTitle('24-HOUR URINE COLLECTION (continued)', margin.left + 5, currentY)
      currentY += 8
    }
    addCheckboxItem(item.label, isTestSelected('urineCollection', item.key), margin.left + 5, currentY)
    currentY += 6
  })

  // Add height and weight if Creatinine Clearance (BSA Corrected) is selected
  if (test.urineCollection.crclc) {
    currentY += 4
    doc.text('Height (cm):', margin.left + 5, currentY)
    doc.text(test.urineCollection.height?.toString() || '', margin.left + 30, currentY)
    doc.text('Weight (kg):', margin.left + 80, currentY)
    doc.text(test.urineCollection.weight?.toString() || '', margin.left + 105, currentY)
    currentY += 8
  }

  // Hepatitis Section
  currentY += 8
  if (checkNewPage(50)) {
    addSectionTitle('HEPATITIS & VIRAL SEROLOGY', margin.left + 5, currentY)
    currentY += 8
  }

  const hepatitisTests = [
    { key: 'heppa', label: 'Acute viral hepatitis undefined etiology' },
    { key: 'hbchb', label: 'Hepatitis B (Hep B S Ab, Hep B S Ag, Hep Bc Tot Ab)' },
    { key: 'hcab', label: 'Hepatitis C (Hep C Ab)' },
    { key: 'haabt', label: 'Hepatitis A (Hep A Total Ab)' },
    { key: 'hbabs', label: 'Hepatitis B (Hep B S Ab)' },
    { key: 'cmva', label: 'Acute CMV (CMV IgM)' },
    { key: 'cmvi', label: 'Chronic or Past Exposure to CMV (CMV IgG)' }
  ]

  hepatitisTests.forEach(item => {
    if (checkNewPage(8)) {
      addSectionTitle('HEPATITIS & VIRAL SEROLOGY (continued)', margin.left + 5, currentY)
      currentY += 8
    }
    addCheckboxItem(item.label, isTestSelected('hepatitis', item.key), margin.left + 5, currentY)
    currentY += 6
  })

  // Microbiology Section
  currentY += 8
  if (checkNewPage(50)) {
    addSectionTitle('MICROBIOLOGY', margin.left + 5, currentY)
    currentY += 8
  }

  const microbiologyTests = [
    { key: 'bloodCultureCAndS', label: 'Blood Culture - C & S' },
    { key: 'cervixSwabGC', label: 'Cervix Swab - G.C.' },
    { key: 'sputumCAndS', label: 'Sputum - C & S' },
    { key: 'sputumTBAfb', label: 'Sputum - TB/AFB' },
    { key: 'stoolCAndS', label: 'Stool - C & S' },
    { key: 'stoolOAndP', label: 'Stool - O & P' },
    { key: 'stoolCDiff', label: 'Stool - CDIFF' },
    { key: 'throatCAndS', label: 'Throat - C & S' },
    { key: 'urethralSwabGC', label: 'Urethral Swab - G.C.' },
    { key: 'urineCatheterCAndS', label: 'Urine - Catheter - C & S' },
    { key: 'urineCatheterYeast', label: 'Urine - Catheter - YEAST' },
    { key: 'urineMidstreamCAndS', label: 'Urine - Midstream - C & S' },
    { key: 'urineMidstreamYeast', label: 'Urine - Midstream - YEAST' },
    { key: 'vaginalBV', label: 'Vaginal - BV' },
    { key: 'vaginalTrich', label: 'Vaginal - TRICH' },
    { key: 'groupBStrep', label: 'VAG/Rectal Swab - GROUP B STREP - PREGNANCY ONLY' }
  ]

  microbiologyTests.forEach(item => {
    if (checkNewPage(8)) {
      addSectionTitle('MICROBIOLOGY (continued)', margin.left + 5, currentY)
      currentY += 8
    }
    addCheckboxItem(item.label, isTestSelected('microbiology', item.key), margin.left + 5, currentY)
    currentY += 6
  })

  // Add source and other tests if specified
  if (test.microbiology.source || test.microbiology.source2 || test.microbiology.otherTests) {
    currentY += 4
    if (test.microbiology.source) {
      doc.text('Source:', margin.left + 5, currentY)
      doc.text(test.microbiology.source, margin.left + 25, currentY)
      currentY += 6
    }
    if (test.microbiology.source2) {
      doc.text('Source 2:', margin.left + 5, currentY)
      doc.text(test.microbiology.source2, margin.left + 25, currentY)
      currentY += 6
    }
    if (test.microbiology.otherTests) {
      doc.text('Other Tests:', margin.left + 5, currentY)
      doc.text(test.microbiology.otherTests, margin.left + 35, currentY)
      currentY += 6
    }
  }

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin.right, pageHeight - 5, { align: 'right' })
  }

  // Add collection information to each page
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    const collectionInfo = `Collection Date: ${test.patientInfo.collectionDate} Time: ${test.patientInfo.collectionTime}`
    doc.text(collectionInfo, margin.left, pageHeight - 12)
  }

  // Save with formatted filename
  const creationDate = new Date(test.createdAt)
  const filename = `SHA-requisition-${format(creationDate, 'yyyy-MM-dd-HHmm')}.pdf`
  doc.save(filename)
} 