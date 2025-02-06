import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { BloodTestForm } from '@/types/blood-test-form'
import { createPath } from '@/lib/utils/form-paths'

interface MicrobiologyStepProps {
  form: UseFormReturn<BloodTestForm>
}

export function MicrobiologyStep({ form }: MicrobiologyStepProps) {
  const { setValue, watch, register } = form
  const values = watch('microbiology')

  const handleCheckboxChange = (id: keyof BloodTestForm['microbiology'], checked: boolean) => {
    setValue(createPath('microbiology', id), checked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Blood Culture */}
        <div className="flex items-center gap-4">
          <Label>Blood Culture</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="bloodCultureCAndS"
              checked={values?.bloodCultureCAndS || false}
              onCheckedChange={(checked) => handleCheckboxChange('bloodCultureCAndS', checked as boolean)}
            />
            <Label htmlFor="bloodCultureCAndS">C & S</Label>
          </div>
        </div>

        {/* Cervix Swab */}
        <div className="flex items-center gap-4">
          <Label>Cervix Swab</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="cervixSwabGC"
              checked={values?.cervixSwabGC || false}
              onCheckedChange={(checked) => handleCheckboxChange('cervixSwabGC', checked as boolean)}
            />
            <Label htmlFor="cervixSwabGC">G.C.</Label>
          </div>
        </div>

        {/* Sputum */}
        <div className="flex items-center gap-4">
          <Label>SPUTUM</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="sputumCAndS"
              checked={values?.sputumCAndS || false}
              onCheckedChange={(checked) => handleCheckboxChange('sputumCAndS', checked as boolean)}
            />
            <Label htmlFor="sputumCAndS">C & S</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="sputumTBAfb"
              checked={values?.sputumTBAfb || false}
              onCheckedChange={(checked) => handleCheckboxChange('sputumTBAfb', checked as boolean)}
            />
            <Label htmlFor="sputumTBAfb">TB/AFB</Label>
          </div>
        </div>

        {/* Stool */}
        <div className="flex items-center gap-4">
          <Label>STOOL</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="stoolCAndS"
              checked={values?.stoolCAndS || false}
              onCheckedChange={(checked) => handleCheckboxChange('stoolCAndS', checked as boolean)}
            />
            <Label htmlFor="stoolCAndS">C & S</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="stoolOAndP"
              checked={values?.stoolOAndP || false}
              onCheckedChange={(checked) => handleCheckboxChange('stoolOAndP', checked as boolean)}
            />
            <Label htmlFor="stoolOAndP">O & P</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="stoolCDiff"
              checked={values?.stoolCDiff || false}
              onCheckedChange={(checked) => handleCheckboxChange('stoolCDiff', checked as boolean)}
            />
            <Label htmlFor="stoolCDiff">CDIFF</Label>
          </div>
        </div>

        {/* Throat */}
        <div className="flex items-center gap-4">
          <Label>THROAT</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="throatCAndS"
              checked={values?.throatCAndS || false}
              onCheckedChange={(checked) => handleCheckboxChange('throatCAndS', checked as boolean)}
            />
            <Label htmlFor="throatCAndS">C & S</Label>
          </div>
        </div>

        {/* Urethral Swab */}
        <div className="flex items-center gap-4">
          <Label>URETHRAL SWAB</Label>
          <div className="flex items-center gap-2">
              <Checkbox
              id="urethralSwabGC"
              checked={values?.urethralSwabGC || false}
              onCheckedChange={(checked) => handleCheckboxChange('urethralSwabGC', checked as boolean)}
            />
            <Label htmlFor="urethralSwabGC">G.C.</Label>
            </div>
        </div>

        {/* Urine - Catheter */}
        <div className="flex items-center gap-4">
          <Label>Urine - Catheter</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="urineCatheterCAndS"
              checked={values?.urineCatheterCAndS || false}
              onCheckedChange={(checked) => handleCheckboxChange('urineCatheterCAndS', checked as boolean)}
            />
            <Label htmlFor="urineCatheterCAndS">C & S</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="urineCatheterYeast"
              checked={values?.urineCatheterYeast || false}
              onCheckedChange={(checked) => handleCheckboxChange('urineCatheterYeast', checked as boolean)}
            />
            <Label htmlFor="urineCatheterYeast">YEAST</Label>
        </div>
      </div>

        {/* Source */}
        <div>
          <Label htmlFor="source">Source:</Label>
          <Input
            id="source"
            {...register('microbiology.source')}
            className="mt-1.5"
            placeholder="Enter source"
          />
        </div>

        {/* Urine - Midstream */}
        <div className="flex items-center gap-4">
          <Label>Urine - Midstream</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="urineMidstreamCAndS"
              checked={values?.urineMidstreamCAndS || false}
              onCheckedChange={(checked) => handleCheckboxChange('urineMidstreamCAndS', checked as boolean)}
            />
            <Label htmlFor="urineMidstreamCAndS">C & S</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="urineMidstreamYeast"
              checked={values?.urineMidstreamYeast || false}
              onCheckedChange={(checked) => handleCheckboxChange('urineMidstreamYeast', checked as boolean)}
            />
            <Label htmlFor="urineMidstreamYeast">YEAST</Label>
          </div>
        </div>

        {/* Vaginal */}
        <div className="flex items-center gap-4">
          <Label>VAGINAL</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="vaginalBV"
              checked={values?.vaginalBV || false}
              onCheckedChange={(checked) => handleCheckboxChange('vaginalBV', checked as boolean)}
            />
            <Label htmlFor="vaginalBV">BV</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="vaginalTrich"
              checked={values?.vaginalTrich || false}
              onCheckedChange={(checked) => handleCheckboxChange('vaginalTrich', checked as boolean)}
            />
            <Label htmlFor="vaginalTrich">TRICH</Label>
          </div>
        </div>

        {/* VAG/Rectal Swab */}
        <div className="flex items-center gap-4">
          <Label>VAG/Rectal Swab</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="groupBStrep"
              checked={values?.groupBStrep || false}
              onCheckedChange={(checked) => handleCheckboxChange('groupBStrep', checked as boolean)}
            />
            <Label htmlFor="groupBStrep">GROUP B STREP - PREGNANCY ONLY</Label>
          </div>
        </div>

        {/* Other Tests */}
        <div>
          <Label htmlFor="otherTests">OTHER TEST:</Label>
          <Input
            id="otherTests"
            {...register('microbiology.otherTests')}
            className="mt-1.5"
            placeholder="Enter other tests"
          />
        </div>

        {/* Source 2 */}
        <div>
          <Label htmlFor="source2">Source:</Label>
          <Input
            id="source2"
            {...register('microbiology.source2')}
            className="mt-1.5"
            placeholder="Enter source"
          />
        </div>
      </div>
    </div>
  )
} 