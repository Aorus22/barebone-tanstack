import { useState } from "react"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useFilteredItems,
} from "@/components/ui/combobox"
import { ShowcaseSection } from "../showcase-section"

type Framework = {
  value: string
  label: string
}

const frameworks: Framework[] = [
  { value: "next", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "vite", label: "Vite" },
  { value: "astro", label: "Astro" },
  { value: "remix", label: "Remix" },
  { value: "gatsby", label: "Gatsby" },
  { value: "solid", label: "SolidJS" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue.js" },
]

function FrameworkListItems() {
  const filtered = useFilteredItems() as Framework[]
  return (
    <>
      <ComboboxEmpty>Framework tidak ditemukan.</ComboboxEmpty>
      {filtered.map((f) => (
        <ComboboxItem key={f.value} value={f}>
          {f.label}
        </ComboboxItem>
      ))}
    </>
  )
}

export function ComboboxPlayground() {
  const [singleValue, setSingleValue] = useState<Framework | null>(
    frameworks.find((f) => f.value === "react") || null
  )
  const [multiValue, setMultiValue] = useState<Framework[]>([
    frameworks.find((f) => f.value === "react")!,
    frameworks.find((f) => f.value === "next")!,
  ])
  const [disabled, setDisabled] = useState(false)

  const singleCode = `import { useState } from "react"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  useFilteredItems,
} from "@/components/ui/combobox"

type Framework = { value: string; label: string }

const frameworks: Framework[] = [
  { value: "next", label: "Next.js" },
  { value: "react", label: "React" },
  // ...
]

const [value, setValue] = useState<Framework | null>(frameworks[1])

function FrameworkListItems() {
  const filtered = useFilteredItems() as Framework[]
  return (
    <>
      <ComboboxEmpty>Framework tidak ditemukan.</ComboboxEmpty>
      {filtered.map((f) => (
        <ComboboxItem key={f.value} value={f}>
          {f.label}
        </ComboboxItem>
      ))}
    </>
  )
}

<Combobox
  value={value}
  onValueChange={setValue}
  items={frameworks}
  disabled={${disabled}}
>
  <ComboboxInput placeholder="Pilih framework..." showClear />
  <ComboboxContent>
    <ComboboxList>
      <FrameworkListItems />
    </ComboboxList>
  </ComboboxContent>
</Combobox>`

  const multiCode = `import { useState } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useFilteredItems,
} from "@/components/ui/combobox"

type Framework = { value: string; label: string }

const [value, setValue] = useState<Framework[]>([frameworks[1], frameworks[0]])

function FrameworkListItems() {
  const filtered = useFilteredItems() as Framework[]
  return (
    <>
      <ComboboxEmpty>Framework tidak ditemukan.</ComboboxEmpty>
      {filtered.map((f) => (
        <ComboboxItem key={f.value} value={f}>
          {f.label}
        </ComboboxItem>
      ))}
    </>
  )
}

<Combobox
  multiple
  value={value}
  onValueChange={setValue}
  items={frameworks}
  disabled={${disabled}}
>
  <ComboboxChips>
    {value.map((v) => (
      <ComboboxChip key={v.value}>
        {v.label}
      </ComboboxChip>
    ))}
    <ComboboxChipsInput placeholder="Pilih beberapa..." />
  </ComboboxChips>
  <ComboboxContent>
    <ComboboxList>
      <FrameworkListItems />
    </ComboboxList>
  </ComboboxContent>
</Combobox>`

  return (
    <div className="space-y-12">
      {/* 1. Single Select */}
      <ShowcaseSection
        id="combobox-single"
        eyebrow="Forms"
        title="Searchable Select (Single Combobox)"
        description="Search and filter items in a popup list. Offers single-value selection and standard clearing capabilities."
        code={singleCode}
        knobs={
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">Disabled</span>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="h-4 w-4 rounded-sm border-border bg-background accent-primary"
            />
          </div>
        }
      >
        <div className="w-full max-w-xs space-y-2">
          <span className="text-xs font-semibold text-muted-foreground">Framework</span>
          <Combobox value={singleValue} onValueChange={setSingleValue} items={frameworks} disabled={disabled}>
            <ComboboxInput placeholder="Pilih framework..." showClear className="w-full" />
            <ComboboxContent>
              <ComboboxList>
                <FrameworkListItems />
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </ShowcaseSection>

      {/* 2. Multi Select with Chips */}
      <ShowcaseSection
        id="combobox-multi"
        eyebrow="Forms"
        title="Searchable Multi-Select (Chips Combobox)"
        description="Multi-value combobox input displaying choices as dismissible tags/chips directly within the input field."
        code={multiCode}
        knobs={
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">Disabled</span>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="h-4 w-4 rounded-sm border-border bg-background accent-primary"
            />
          </div>
        }
      >
        <div className="w-full max-w-xs space-y-2">
          <span className="text-xs font-semibold text-muted-foreground">Frameworks</span>
          <Combobox multiple value={multiValue} onValueChange={setMultiValue} items={frameworks} disabled={disabled}>
            <ComboboxChips className="w-full">
              {multiValue.map((v) => (
                <ComboboxChip key={v.value}>
                  {v.label}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={multiValue.length === 0 ? "Pilih beberapa..." : ""} />
            </ComboboxChips>
            <ComboboxContent>
              <ComboboxList>
                <FrameworkListItems />
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </ShowcaseSection>
    </div>
  )
}
