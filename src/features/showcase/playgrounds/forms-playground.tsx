import { useState } from "react"
import { Mail, Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Slider } from "@/components/ui/slider"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "@/components/ui/field"
import { toast } from "sonner"
import { ShowcaseSection } from "../showcase-section"

export function InputPlayground() {
  const [showPassword, setShowPassword] = useState(false)

  const defaultCode = `import { Input } from "@/components/ui/input"

<Input type="email" placeholder="Email" />`

  const prefixCode = `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Mail } from "lucide-react"

<InputGroup>
  <InputGroupAddon align="inline-start">
    <Mail className="size-4" />
  </InputGroupAddon>
  <InputGroupInput placeholder="Enter email address..." />
</InputGroup>`

  const suffixCode = `import { useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"
import { Eye, EyeOff } from "lucide-react"

const [showPassword, setShowPassword] = useState(false)

<InputGroup>
  <InputGroupInput 
    placeholder="Enter password..." 
    type={showPassword ? "text" : "password"} 
  />
  <InputGroupAddon align="inline-end">
    <InputGroupButton 
      variant="ghost" 
      size="icon-xs"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`

  const disabledCode = `import { Input } from "@/components/ui/input"

<Input disabled placeholder="Disabled input" />`

  const invalidCode = `import { Input } from "@/components/ui/input"

<Input aria-invalid="true" placeholder="Invalid input" />`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#prefix" className="hover:text-foreground hover:underline transition-colors">• With Icon (Prefix)</a>
        <a href="#suffix" className="hover:text-foreground hover:underline transition-colors">• Password Toggle (Suffix)</a>
        <a href="#disabled" className="hover:text-foreground hover:underline transition-colors">• Disabled</a>
        <a href="#invalid" className="hover:text-foreground hover:underline transition-colors">• Invalid (Error)</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Forms"
        title="Default"
        description="A default text input field."
        code={defaultCode}
      >
        <div className="w-full max-w-xs">
          <Input type="email" placeholder="Email" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="prefix"
        eyebrow="Forms"
        title="With Icon (Prefix)"
        description="An input group incorporating a leading icon addon."
        code={prefixCode}
      >
        <div className="w-full max-w-xs">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Mail className="size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Enter email address..." />
          </InputGroup>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="suffix"
        eyebrow="Forms"
        title="Password Toggle (Suffix)"
        description="An input group incorporating a trailing password visibility toggle addon."
        code={suffixCode}
      >
        <div className="w-full max-w-xs">
          <InputGroup>
            <InputGroupInput
              placeholder="Enter password..."
              type={showPassword ? "text" : "password"}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="disabled"
        eyebrow="Forms"
        title="Disabled"
        description="An input field blocked from user interaction."
        code={disabledCode}
      >
        <div className="w-full max-w-xs">
          <Input disabled placeholder="Disabled input" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="invalid"
        eyebrow="Forms"
        title="Invalid (Error)"
        description="An input field marked with error validation states."
        code={invalidCode}
      >
        <div className="w-full max-w-xs">
          <Input aria-invalid="true" placeholder="Invalid input" />
        </div>
      </ShowcaseSection>
    </div>
  )
}

export function FieldPlayground() {
  const defaultCode = `import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field>
  <FieldLabel>Campaign Name</FieldLabel>
  <FieldContent>
    <Input placeholder="e.g. Q3 Retargeting" />
    <FieldDescription>Provide a short, descriptive name.</FieldDescription>
  </FieldContent>
</Field>`

  const requiredCode = `import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field>
  <FieldLabel>
    Campaign Name <span className="text-destructive">*</span>
  </FieldLabel>
  <FieldContent>
    <Input placeholder="e.g. Q3 Retargeting" />
    <FieldDescription>Provide a short, descriptive name.</FieldDescription>
  </FieldContent>
</Field>`

  const errorCode = `import { Field, FieldLabel, FieldContent, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field>
  <FieldLabel>Campaign Name</FieldLabel>
  <FieldContent>
    <Input aria-invalid="true" placeholder="e.g. Q3 Retargeting" />
    <FieldDescription>Provide a short, descriptive name.</FieldDescription>
    <FieldError>Campaign name is required.</FieldError>
  </FieldContent>
</Field>`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#required" className="hover:text-foreground hover:underline transition-colors">• Required</a>
        <a href="#error" className="hover:text-foreground hover:underline transition-colors">• With Validation Error</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Forms"
        title="Default Field"
        description="A standard field wrapper providing a label, input, and helper description text."
        code={defaultCode}
      >
        <Field className="w-full max-w-xs">
          <FieldLabel>Campaign Name</FieldLabel>
          <FieldContent>
            <Input placeholder="e.g. Q3 Retargeting" />
            <FieldDescription>Provide a short, descriptive name for your sprint.</FieldDescription>
          </FieldContent>
        </Field>
      </ShowcaseSection>

      <ShowcaseSection
        id="required"
        eyebrow="Forms"
        title="Required Indicator"
        description="A field displaying a red required asterisk marker."
        code={requiredCode}
      >
        <Field className="w-full max-w-xs">
          <FieldLabel>
            Campaign Name <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input placeholder="e.g. Q3 Retargeting" />
            <FieldDescription>Provide a short, descriptive name for your sprint.</FieldDescription>
          </FieldContent>
        </Field>
      </ShowcaseSection>

      <ShowcaseSection
        id="error"
        eyebrow="Forms"
        title="With Validation Error"
        description="A field displaying error states and validation text."
        code={errorCode}
      >
        <Field className="w-full max-w-xs">
          <FieldLabel>Campaign Name</FieldLabel>
          <FieldContent>
            <Input aria-invalid="true" placeholder="e.g. Q3 Retargeting" />
            <FieldDescription>Provide a short, descriptive name for your sprint.</FieldDescription>
            <FieldError>Campaign name is required.</FieldError>
          </FieldContent>
        </Field>
      </ShowcaseSection>
    </div>
  )
}

export function CheckboxSwitchPlayground() {
  const checkboxCode = `import { Checkbox } from "@/components/ui/checkbox"

<Checkbox onCheckedChange={(checked) => console.log(checked)} />`

  const checkboxDisabledCode = `import { Checkbox } from "@/components/ui/checkbox"

<Checkbox disabled />`

  const switchCode = `import { Switch } from "@/components/ui/switch"

<Switch onCheckedChange={(checked) => console.log(checked)} />`

  const switchSmallCode = `import { Switch } from "@/components/ui/switch"

<Switch size="sm" />`

  const switchDisabledCode = `import { Switch } from "@/components/ui/switch"

<Switch disabled />`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#checkbox-default" className="hover:text-foreground hover:underline transition-colors">Checkbox Default</a>
        <a href="#checkbox-disabled" className="hover:text-foreground hover:underline transition-colors">• Checkbox Disabled</a>
        <a href="#switch-default" className="hover:text-foreground hover:underline transition-colors">• Switch Default</a>
        <a href="#switch-small" className="hover:text-foreground hover:underline transition-colors">• Switch Small</a>
        <a href="#switch-disabled" className="hover:text-foreground hover:underline transition-colors">• Switch Disabled</a>
      </div>

      <ShowcaseSection
        id="checkbox-default"
        eyebrow="Forms"
        title="Checkbox Default"
        description="A simple two-state checkbox selector."
        code={checkboxCode}
      >
        <label className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/50 p-3 hover:bg-muted/10 cursor-pointer transition-all w-full max-w-xs">
          <Checkbox
            onCheckedChange={(checked) => {
              toast.info(`Checkbox state: ${checked ? "Checked" : "Unchecked"}`)
            }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Enable Notifications</span>
            <span className="text-xs text-muted-foreground">Receive digest reports via email.</span>
          </div>
        </label>
      </ShowcaseSection>

      <ShowcaseSection
        id="checkbox-disabled"
        eyebrow="Forms"
        title="Checkbox Disabled"
        description="A checkbox component blocked from interaction."
        code={checkboxDisabledCode}
      >
        <label className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/50 p-3 opacity-50 cursor-not-allowed w-full max-w-xs">
          <Checkbox disabled />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Enable Notifications</span>
            <span className="text-xs text-muted-foreground">Receive digest reports via email.</span>
          </div>
        </label>
      </ShowcaseSection>

      <ShowcaseSection
        id="switch-default"
        eyebrow="Forms"
        title="Switch Default"
        description="A standard binary switch selector."
        code={switchCode}
      >
        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-3 hover:bg-muted/10 cursor-pointer transition-all w-full max-w-xs">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Maintenance Mode</span>
            <span className="text-xs text-muted-foreground">Put application into read-only mode.</span>
          </div>
          <Switch
            onCheckedChange={(checked) => {
              toast.info(`Switch state: ${checked ? "On" : "Off"}`)
            }}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="switch-small"
        eyebrow="Forms"
        title="Switch Small Size"
        description="A smaller compact size variant of the switch."
        code={switchSmallCode}
      >
        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-3 hover:bg-muted/10 cursor-pointer transition-all w-full max-w-xs">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Compact Toggle</span>
            <span className="text-xs text-muted-foreground">Use the smaller variant of the switch.</span>
          </div>
          <Switch size="sm" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="switch-disabled"
        eyebrow="Forms"
        title="Switch Disabled"
        description="A switch component blocked from interaction."
        code={switchDisabledCode}
      >
        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-3 opacity-50 cursor-not-allowed w-full max-w-xs">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Maintenance Mode</span>
            <span className="text-xs text-muted-foreground">Put application into read-only mode.</span>
          </div>
          <Switch disabled />
        </div>
      </ShowcaseSection>
    </div>
  )
}

export function SelectPlayground() {
  const defaultCode = `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Pilih timezone..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="gmt7">Asia/Jakarta (GMT+7)</SelectItem>
    <SelectItem value="gmt8">Asia/Singapore (GMT+8)</SelectItem>
    <SelectItem value="utc">Universal Coordinated Time (UTC)</SelectItem>
  </SelectContent>
</Select>`

  const disabledCode = `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Pilih timezone..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="gmt7">Asia/Jakarta (GMT+7)</SelectItem>
  </SelectContent>
</Select>`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#disabled" className="hover:text-foreground hover:underline transition-colors">• Disabled</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Forms"
        title="Default Select"
        description="A standard accessible options select dropdown picker."
        code={defaultCode}
      >
        <div className="w-full max-w-xs">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih timezone..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gmt7">Asia/Jakarta (GMT+7)</SelectItem>
              <SelectItem value="gmt8">Asia/Singapore (GMT+8)</SelectItem>
              <SelectItem value="utc">Universal Coordinated Time (UTC)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="disabled"
        eyebrow="Forms"
        title="Disabled Select"
        description="A select dropdown picker blocked from user interaction."
        code={disabledCode}
      >
        <div className="w-full max-w-xs">
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Pilih timezone..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gmt7">Asia/Jakarta (GMT+7)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ShowcaseSection>
    </div>
  )
}

export function DatePickerPlayground() {
  const [date, setDate] = useState<string>("2026-07-08")

  const defaultCode = `import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

const [date, setDate] = useState("2026-07-08")

<DatePicker value={date} onChange={setDate} />`

  const disabledCode = `import { DatePicker } from "@/components/ui/date-picker"

<DatePicker disabled value="2026-07-08" />`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#disabled" className="hover:text-foreground hover:underline transition-colors">• Disabled</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Forms"
        title="DatePicker Default"
        description="An interactive calendar date selection picker."
        code={defaultCode}
      >
        <div className="w-full max-w-xs flex flex-col gap-2">
          <DatePicker value={date} onChange={setDate} />
          {date && (
            <span className="text-xs text-muted-foreground text-center">
              Output: <code className="font-semibold bg-muted px-1.5 py-0.5 rounded">{date}</code>
            </span>
          )}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="disabled"
        eyebrow="Forms"
        title="DatePicker Disabled"
        description="A DatePicker component blocked from interaction."
        code={disabledCode}
      >
        <div className="w-full max-w-xs">
          <DatePicker disabled value="2026-07-08" />
        </div>
      </ShowcaseSection>
    </div>
  )
}

export function SliderPlayground() {
  const [value, setValue] = useState([40])

  const defaultCode = `import { useState } from "react"
import { Slider } from "@/components/ui/slider"

const [val, setVal] = useState([40])

<Slider value={val} onValueChange={setVal} min={0} max={100} />`

  const disabledCode = `import { Slider } from "@/components/ui/slider"

<Slider disabled value={[40]} min={0} max={100} />`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#disabled" className="hover:text-foreground hover:underline transition-colors">• Disabled</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Forms"
        title="Slider Default"
        description="An interactive sliding range selection input."
        code={defaultCode}
      >
        <div className="w-full max-w-xs flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Volume Level</span>
            <span className="font-bold text-primary">{value[0]}%</span>
          </div>
          <Slider
            value={value}
            onValueChange={setValue}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="disabled"
        eyebrow="Forms"
        title="Slider Disabled"
        description="A slider component blocked from interaction."
        code={disabledCode}
      >
        <div className="w-full max-w-xs flex flex-col gap-4 opacity-50 cursor-not-allowed">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Volume Level</span>
            <span className="font-bold text-primary">40%</span>
          </div>
          <Slider
            disabled
            value={[40]}
            min={0}
            max={100}
          />
        </div>
      </ShowcaseSection>
    </div>
  )
}
